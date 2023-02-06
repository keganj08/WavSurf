import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// LOADER: An icon to be displayed while content is loading
export default function Loader(props) {

    return(
    <div class="loadingWrapper">
        <FontAwesomeIcon className="loadingSpinner" icon="fa-solid fa-circle-notch fa-spin" spin />
    </div>
    );
}