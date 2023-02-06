import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// MESSAGEMODAL: An alert that can be displayed at the bottom of any page
    // showing: Boolean
    // type: Determines message color and icon; Should be "error", "confirm", or "info"
    // content: String; Message of the alert
export default function MessageModal(props) {
    
    let classes = "msgModal";
    let iconType;

    if(!props.showing) classes += " collapsed";

    if(props.type == "confirm") {
        iconType = "fa-circle-check";
        classes += " msgConfirm";
    } else if(props.type == "error") {
        iconType = "fa-circle-exclamation";
        classes += " msgError";
    } else {
        iconType = "fa-circle-info";
    }

    return (
        <div className={classes}>
            <FontAwesomeIcon className="msgIcon" icon={iconType} />
            <p>{props.content}</p>
        </div>
    );
}