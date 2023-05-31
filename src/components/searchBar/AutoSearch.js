import React, { useState, useEffect } from 'react';
import { FormControl, ListGroup } from 'react-bootstrap';
import axiosInstance from '../../utils/axiosUtil';
import { ToastContainer, toast } from 'react-toastify';
import { toastOptions } from '../../utils/error';
import { BsPersonFillCheck } from "react-icons/bs";

const AutocompleteSearch = ({ onSelect }) => {
  console.log({ onSelect })
  const [selectedItem, setSelectedItem] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    // Call your API here with the updated search term
    // and update the filtered options based on the API response
    if (searchTerm) {
      (async () => {
        try {
          const { data } = await axiosInstance(`/api/warehouse/?keyword=${searchTerm}`);
          setFilteredOptions(data.warehouses);
        } catch (error) {
          toast.error(error, toastOptions);
        }
      })();
    } else setFilteredOptions([]);
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setSelectedItem(null);
  };

  const handleSelectOption = (option) => {
    console.log({option})
    setSearchTerm('');
    onSelect(option);
    setFilteredOptions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      if (!selectedItem) setSelectedItem(filteredOptions.length - 1);
      else setSelectedItem(selectedItem - 1);
    } else if (e.key === 'ArrowDown') {
      console.log({ selectedItem })
      setSelectedItem((prev) => {
        if (prev === filteredOptions.length - 1 || prev === null) return 0;
        return prev + 1;
      });
    }
  };

  console.log({ filteredOptions })
  return (
    <div style={{ position: "relative" }}>
      <FormControl
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
      {filteredOptions.length > 0 && (
        <ListGroup className="autocomplete-list">
          {filteredOptions.map((warehouse, idx) => {
            const { id, name, manager, controller } = warehouse;
            console.log(idx, selectedItem);
            return (
              <ListGroup.Item
                className={`autocomplete-item ${idx === selectedItem ? 'selected' : ''}`}
                key={id}
                onClick={() => handleSelectOption(warehouse)}
              >
                {id} | {name} {manager && ` | manager: ${manager.fullname}`} {controller && ` | controller: ${controller.fullname}`}
                {/* {manager && <BsPersonFillCheck />}
                {controller && <BsPersonFillCheck />} */}
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      )}
      <ToastContainer />
    </div>
  );
};

export default AutocompleteSearch;
