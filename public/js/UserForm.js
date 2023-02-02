/*
    <UserForm
        fields = {
            username: "", 
            password: ""
        }
    />
*/


export default function LoginForm(props) {
    const [inputFields, setInputFields] = useState([props.fields]);
    /*
    const [values, setValues] = useState({
        username: '',
        password: '',
        submit: '',
    });
    */
    const [submitted, setSubmitted] = useState(false);

    const handleUsernameInputChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values, // spread operator
            username: event.target.value,
        }));
    }
    const handlePasswordInputChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values, // spread operator
            password: event.target.value,
        }));
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        attemptLogin(values.username, values.password);
        setSubmitted(true);
    }

    return (
        <form onSubmit={handleSubmit}>

            <input 
                id = "newAccountUsername"
                type = "text"
                placeholder = "Username"
                value = {values.username} 
                onChange={handleUsernameInputChange} 
            />
            <input 
                id = "newAccountPassword"
                type = "password" 
                placeholder = "Password"
                value = {values.password} 
                onChange = {handlePasswordInputChange}
            />
            {loginResult == -1 && <span className="errorMsg">Incorrect username or password. Try again</span>}
            {loginResult == -2 && <span className="errorMsg">A server error occurred. Try again</span>}
            <input 
                id = "newAccountSubmit"
                type = "submit" 
                value = "Log In"
            />
        </form>
    );
}