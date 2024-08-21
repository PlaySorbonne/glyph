import React from "react";
import styles from "./Table.module.css";
import Link from "next/link";

type TableProps<
  T extends Record<
    string,
    string | number | boolean | null | undefined | ((obj: T) => string)
  >
> = {
  data: T[];
  columns?: string[];
  maxStringLength?: number;
};

export default function Table<
  T extends Record<
    string,
    string | number | boolean | null | undefined | ((obj: T) => string)
  >
>({ data, columns, maxStringLength = 50 }: TableProps<T>) {

  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  const columnNames = columns || Object.keys(data[0]);
  const keys = Object.keys(data[0]);

  const truncateString = (str: string) => {
    if (str.length <= maxStringLength) return str;
    return str.slice(0, maxStringLength) + "...";
  };

  const renderCell = (item: T, key: string) => {
    if (key === "href") return undefined;

    const value = item[key];

    if (value === null || value === undefined) {
      return "-";
    }

    const stringValue =
      typeof value === "function"
        ? (value as (obj: T) => string)(item)
        : String(value);

    const truncatedValue = truncateString(stringValue);

    if ("href" in item && typeof item.href === "string") {
      return (
        <Link href={item.href} className={styles.cellLink}>
          {truncatedValue}
        </Link>
      );
    }

    return truncatedValue;
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columnNames.map((columnName) => {
            if (columnName === "href") return undefined;
            return (
            <th key={columnName}>{columnName}</th>
          )})}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {keys.map((key) => (
                <td key={key}>{renderCell(item, key)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
