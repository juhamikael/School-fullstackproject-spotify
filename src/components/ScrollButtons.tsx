import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";

const ScrollButtons = () => {
    const scrollTo = (where: string) => {
        if (where === "top") {
            window.scrollTo(0, 0);
        } else if (where === "bottom") {
            window.scrollTo(0, document.body.scrollHeight);
        }
    };
    return (
      <div className="float-right sticky bottom-4 grid grid-cols-1">
          <button
            className="btn btn-circle bg-c-dark-2 mr-10 mb-3"
            onClick={() => {
                scrollTo("top");
            }}
          >
              <FontAwesomeIcon
                className="h-6 w-6 text-cyan-300"
                icon={faArrowUp}
              />
          </button>
          <button
            className="btn btn-circle bg-c-dark-2 mr-10 "
            onClick={() => {
                scrollTo("bottom");
            }}
          >
              <FontAwesomeIcon
                className="h-6 w-6 text-cyan-300"
                icon={faArrowDown}
              />
          </button>
      </div>
    );
}
export default ScrollButtons;