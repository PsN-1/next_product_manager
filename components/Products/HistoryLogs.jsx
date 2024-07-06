import { classNames } from "../../utils/index";
import { CheckCircleIcon } from "@heroicons/react/24/solid/index.js";
import PropTypes from "prop-types";

export function HistoryLogs({ activity }) {
  return (
    <>
      <ul role="list" className="space-y-6">
        <p className="text-base font-semibold leading-7 mb-5">
          Últmas Atualizações
        </p>
        {activity.map((activityItem, activityItemIdx) => (
          <li key={activityItem.id} className="relative flex gap-x-4">
            <div
              className={classNames(
                activityItemIdx === activity.length - 1 ? "h-6" : "-bottom-6",
                "absolute left-0 top-0 flex w-6 justify-center",
              )}
            >
              <div className="w-px bg-gray-200" />
            </div>
            <div className="relative flex h-6 w-6 flex-none items-center justify-center">
              {activityItem.abbreviation === "Obs" ? (
                <CheckCircleIcon
                  className="h-6 w-6 text-indigo-600"
                  aria-hidden="true"
                />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
              )}
            </div>
            {activityItem.abbreviation === "Obs" ? (
              <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                <span className="font-medium text-gray-900">
                  {activityItem.new_value}
                </span>
              </p>
            ) : (
              <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                <span className="font-medium text-gray-900">
                  {activityItem.abbreviation === "Qtd"
                    ? "Quantidade"
                    : activityItem.abbreviation}
                </span>{" "}
                <span>
                  {activityItem.abbreviation === "Preço"
                    ? "alterado "
                    : "alterada "}
                </span>
                <strong>de:</strong> {activityItem.old_value}{" "}
                <strong>para:</strong> {activityItem.new_value}
              </p>
            )}
            <time className="flex-none py-0.5 text-xs leading-5 text-gray-500">
              {activityItem.date}
            </time>
          </li>
        ))}
      </ul>
    </>
  );
}

HistoryLogs.propTypes = {
  activity: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      abbreviation: PropTypes.string,
      old_value: PropTypes.string,
      new_value: PropTypes.string,
      date: PropTypes.string,
    }),
  ),
};
