import get from "lodash/get";
import map from "lodash/map";
import size from "lodash/size";
import React from "react";
import isEmpty from "lodash/isEmpty";

interface IMapperProps<T> {
  children: (
    item: T,
    info: {
      index: number;
      firstItem: boolean;
      lastItem: boolean;
      isOdd: boolean;
    }
  ) => React.ReactNode;
  data: T[];
  extractedKey?: keyof T;
  isShowEmpty?: boolean;
}

const Mapper = <T,>({
  children,
  data: items = [],
  extractedKey,
  isShowEmpty = false,
}: IMapperProps<T>) => {
  return (
    <React.Fragment>
      {!isEmpty(items)
        ? map(items, (item, index) => (
            <React.Fragment
              key={extractedKey ? get(item, extractedKey, index) : index}
            >
              {children(item, {
                index: +index,
                firstItem: +index === 0,
                lastItem: size(items) - 1 === +index,
                isOdd: +index % 2 !== 0,
              })}
            </React.Fragment>
          ))
        : isShowEmpty && (
            <p className="px-4 py-3 text-[15px] text-gray-500">
              No data found.
            </p>
          )}
    </React.Fragment>
  );
};

export default Mapper;
