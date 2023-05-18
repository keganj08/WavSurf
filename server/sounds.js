import { CloudFrontClient, AssociateAliasCommand } from "@aws-sdk/client-cloudfront";
import * as https from "https";
import s3_list from './s3_listobjects.js';

let allSounds = [];

// Adds a sound to the server's array
// Returns true if the sound was successfully added, and false if not
export function server_addSound(title, author) {
  allSounds.push({title, author});
  if(allSounds.find(sound => sound.title === title && sound.author === author)) {
    return true;
  } else {
    return false;
  }
}

// Attempts to delete a sound from the server's array given a title and author
// Returns true if a matching sound was found and deleted, and false if not
export function server_deleteSound(title, author) {
  let index = allSounds.findIndex(sound => sound.title === title && sound.author === author);
  if(index) {
    allSounds.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

// Returns the server's sound array, filtering by author and/or title if provided
export function server_getSounds(author=undefined, title=undefined) {
  if(author || title) {
    return allSounds.filter(sound => {
      if( (!author || sound.author == author) && (!title || sound.title == title) ) return sound; 
    });
  } else {
    return allSounds;
  }
}

// Makes an expensive S3 List Request to retrieve all sounds stored in the site bucket and update the server's array
export async function server_expensivelyUpdateSounds() {
    const s3SoundsList = await s3_list("sounds");
    
    let retrievedSounds = [];
    for(let i=0; i<s3SoundsList.Contents.length; i++) {
        if(s3SoundsList.Contents[i].Key.indexOf("sounds/") != -1) {
            let authorPath = s3SoundsList.Contents[i].Key.split("sounds/")[1];
            if(authorPath.indexOf("/") !=  -1) {
                let title = authorPath.split("/")[1];
                let author = authorPath.split("/")[0];
                retrievedSounds.push({title, author});
            }
        }
    }

    allSounds = retrievedSounds;
}
