import { useState, useEffect } from "react";

// ENTRYFORM: A blueprint for all forms within the app
    // fields: An array of objects containing information on each input such as title, type, whether it is readOnly, etc.
    // submitText: The value of the form's submit button
    // submitFunction: A callback function to be called when the user clicks submit
export default function EntryForm({fields, submitText, submitFunction}) {
    const [inputValues, setInputValues] = useState({}); 
    const [submitted, setSubmitted] = useState(false);

    // Immediately set inputValues of readOnly inputs with predefined values
    useEffect(() => {
        for(var i=0; i<fields.length; i++) {
            if(fields[i].readOnly && fields[i].value) {
                setInputValues((values) => ({
                    ...values,
                    [fields[i].title]: fields[i].value,
                }));
            }
        }
    }, []);

    // Store the users entries in inputValues
    const handleInputChange = (event) => {
        event.persist();
        setInputValues((values) => ({
            ...values,
            [event.target.id]: event.target.value,
        }));
    }

    // 
    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        submitFunction(inputValues);
    }

    return (
        <form className="formGrid" onSubmit={handleSubmit}>
            
            {fields.map((field, i) => (
                <React.Fragment key={"formField-" + i}>
                    {field.showLabel && 
                    <label
                        id = {field.title + "-label"}
                        className = "formGridLabel"
                    >
                        {field.title[0].toUpperCase() + field.title.substring(1) + ":"}
                    </label>}
                    
                    <input 
                        id = {field.title}
                        key = {"formInput-" + i}
                        className = "formGridInput"
                        type = {field.type}
                        readOnly = {field.readOnly}
                        value = {field.value ? field.value : inputValues.id}
                        placeholder = {field.placeholder ? field.placeholder : field.title[0].toUpperCase() + field.title.substring(1)} 
                        onChange = {handleInputChange}
                    /> 
                </React.Fragment>
            ))}

            <input 
                id = "submit"
                className = "formGridSubmit"
                type = "submit" 
                value = {submitText}
            />
        </form>
    );
}