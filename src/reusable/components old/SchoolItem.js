import React, { useState } from 'react';

const SchoolItem = (props) => {
  return (
    <>
      <li
        className='list-group-item list-group-item-action'
        onClick={props?.onClick}
      >
        <div className='row'>
          <img
            className='col-md-2 col-sm-2 rounded-circle '
            style={{ maxWidth: '125px' }}
            src={props.logoImgURL}
          />
          <div className='col-md-10 col-sm-10'>
            <h5 className='d-flex w-100 justify-content-between'>
              {props.schoolName}
            </h5>
          </div>
        </div>
      </li>
    </>
  );
};

export default SchoolItem;
