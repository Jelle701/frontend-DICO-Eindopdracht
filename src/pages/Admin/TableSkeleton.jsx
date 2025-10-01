import React from 'react';
import './TableSkeleton.css';

const SkeletonRow = () => (
    <div className="skeleton-row">
        <div className="skeleton-cell skeleton-checkbox"></div>
        <div className="skeleton-cell skeleton-id"></div>
        <div className="skeleton-cell skeleton-email"></div>
        <div className="skeleton-cell skeleton-name"></div>
        <div className="skeleton-cell skeleton-role"></div>
        <div className="skeleton-cell skeleton-date"></div>
        <div className="skeleton-cell skeleton-actions"></div>
    </div>
);

const TableSkeleton = ({ rows = 10 }) => {
    return (
        <div className="skeleton-table">
            {Array.from({ length: rows }).map((_, index) => (
                <SkeletonRow key={index} />
            ))}
        </div>
    );
};

export default TableSkeleton;
