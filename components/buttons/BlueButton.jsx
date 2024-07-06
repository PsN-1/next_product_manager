import PropTypes from "prop-types";
import { classNames } from "../../utils/index";

export const BlueButton = ({ text, onClick, className }) => (
  <div>
    <button
      onClick={onClick}
      className={classNames(
        "mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto",
        className,
      )}
    >
      {text}
    </button>
  </div>
);

BlueButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
