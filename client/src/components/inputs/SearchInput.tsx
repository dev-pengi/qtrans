import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import ActivityIndicator from "../loaders/ActivityIndicator";

interface SearchInputProps {
  placeholder: string;
  value: string;
  handleType: (value: string) => void;
  isLoading: boolean;
  autoFocus?: boolean;
}

const SearchInput: FC<Partial<SearchInputProps>> = ({
  value,
  handleType,
  placeholder,
  isLoading,
  autoFocus,
}) => {
  return (
    <div className="w-full relative shadow-sm">
      <div className="absolute top-0 bottom-0 my-auto left-[12px] h-max">
        {isLoading ? (
          <ActivityIndicator size={8} />
        ) : (
          <FontAwesomeIcon icon={faSearch} className="text-gray-4" />
        )}
      </div>
      <input
        onChange={(e) => handleType && handleType(e.target.value)}
        value={value}
        type="text"
        autoFocus={autoFocus}
        className={`py-[9px] text-[15px] w-full rounded-md bg-white/10 placeholder:text-gray-3 pl-10`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchInput;
