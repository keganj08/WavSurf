import { useState, useEffect } from 'react';

// Fields: An array of objects containing information on each input's title, type, initial value, and whether it is readOnly
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

    const handleInputChange = (event) => {
        event.persist();
        setInputValues((values) => ({
            ...values,
            [event.target.id]: event.target.value,
        }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        submitFunction(inputValues);
        setSubmitted(true);
    }

    return (
        <form className="formGrid" onSubmit={handleSubmit}>
            
            {fields.map((field, i) => (
                <input 
                    id = {field.title}
                    key = {"formInput-" + i}
                    className = "formGridInput"
                    type = {field.type}
                    readOnly = {field.readOnly}
                    value = {field.value ? field.value : inputValues.id}
                    placeholder = {field.title} 
                    onChange = {handleInputChange}
                /> 
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