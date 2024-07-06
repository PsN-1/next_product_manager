"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid/index.js";
import PropTypes from "prop-types";
import { BlueButton } from "./Buttons/BlueButton.jsx";
import { useEffect, useState } from "react";
import { classNames } from "../utils/index";

export const SearchBar = ({ onEnterPressed, tabs }) => {
  const [selectedTab, setSelectedTab] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleKeyPressed = (e) => {
    if (e.key === "Enter") {
      onEnterPressed({ searchText, selectedTab });
    }
  };
  const handleSearchPressed = (e) => {
    e.preventDefault();
    onEnterPressed({ searchText, selectedTab });
  };

  useEffect(() => {
    if (tabs) {
      setSelectedTab(tabs[0]);
    }
  }, []);

  return (
    <>
      <div className="sm:items-center sm:flex flex-row w-full">
        <div className="relative flex rounded-md grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            id="search"
            name="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyUp={handleKeyPressed}
            placeholder="Search"
            type="search"
            className={classNames(
              tabs ? "rounded-none rounded-l-md" : "rounded-md",
              tabs ? "ring-inset focus:ring-inset  focus:ring-2" : "",
              "pl-10 block w-full min-w-0 flex-1 border-0 py-1.5 text-gray-900 ring-1  ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 sm:text-sm sm:leading-6",
            )}
          />

          {tabs && (
            <select
              id="currency"
              name="currency"
              className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 pl-3 pr-8 text-gray-500 sm:text-sm focus:ring-indigo-600"
              value={selectedTab}
              onChange={(e) => setSelectedTab(e.target.value)}
            >
              {tabs.map((tab) => (
                <option key={tab} value={tab}>
                  {tab}
                </option>
              ))}
            </select>
          )}
        </div>
        <BlueButton onClick={handleSearchPressed} text="Search" />
      </div>
    </>
  );
};

SearchBar.propTypes = {
  onEnterPressed: PropTypes.func,
  tabs: PropTypes.array,
};
