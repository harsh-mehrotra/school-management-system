import { useLocation, Link } from "react-router-dom";
import React from "react";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="text-sm p-1 z-5 max-w-[100%] w-full top-0 h-10 flex justify-start items-center backdrop-blur-2xl rounded-t-[32px]">
      <ul className="flex space-x-2">
        {pathnames.map((value, index) => {
          const pathTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const isSecondLast = index === pathnames.length - 2;
          
          // Check if it's an edit-teacher page with ID
          const isEditTeacherPage =
            pathnames.length >= 2 &&
            pathnames[pathnames.length - 2] === "edit-teacher";

          const isId = isLast && isEditTeacherPage; // If last breadcrumb is an ID

          return (
            <li key={index} className="flex">
              {index !== 0 && <span className="mx-2">/</span>}

              {/* Make Edit Teacher and ID non-clickable */}
              {isId || (isSecondLast && isEditTeacherPage) ? (
                <span className="text-gray-500 capitalize font-bold">
                  {value.replace("-", " ")}
                </span>
              ) : (
                <Link to={pathTo} className="text-gray-600 capitalize font-bold hover:underline">
                  {value.replace("-", " ")}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
