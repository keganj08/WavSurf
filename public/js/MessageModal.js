import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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