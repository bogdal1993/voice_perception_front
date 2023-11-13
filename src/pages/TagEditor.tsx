import React, { useState, useEffect, useContext } from 'react';
import CreatableSelect from 'react-select';
import axios from 'axios';
import { apiUrl } from '../data/chartsData';
import { NavigationContext } from '../context/navContext';

interface Tag {
  tag_id: number;
  tag_name: string;
  tag_spk: number;
  tag_texts: string[];
}

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

const EditableTable: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const Inav = useContext(NavigationContext);
  const [inputWord, setInputWord] = useState('');


  const mainActiveClassname = Inav.navigationOpen ? 'active' : '';
  const mainClassnames = ['main','padding15', 'overflowauto', mainActiveClassname];

  useEffect(() => {
    axios.get(`${apiUrl}backend/tags/list/`)
      .then(response => {console.log(response.data);setTags(response.data)})
      .catch(error => console.error(error));
  }, []);

  const handleTagTextsChange = (tagId: number, selectedOptions: readonly Option[]) => {
    if (selectedOptions) {
      const updatedTags = tags.map(tag => {
        if (tag.tag_id === tagId) {
          return { ...tag, tag_texts: selectedOptions.map(option => option.value) };
        }
        return tag;
      });
      setTags(updatedTags);
    }
  };

  const handleTagNameChange = (tagId: number, value: string) => {
    if (value) {
      const updatedTags = tags.map(tag => {
        if (tag.tag_id === tagId) {
          return { ...tag, tag_name: value };
        }
        return tag;
      });
      setTags(updatedTags);
    }
  };

  const handleSaveTag = (tagId: number) => {
    const tagToUpdate = tags.find(tag => tag.tag_id === tagId);
    if (tagToUpdate) {
      axios.put(`${apiUrl}backend/tag/save/${tagId}`, tagToUpdate)
        .then(response => console.log(`Тег ${tagId} успешно сохранен`, response))
        .catch(error => console.error(`Ошибка при сохранении тега ${tagId}`, error));
    }
  };

  const handleInputChange = (inputValue: string, actionMeta: { action: string }) => {
    if (actionMeta.action === 'input-change') {
        setInputWord(inputValue);
      //console.log('Input value changed to:', inputValue);
      // Ваша логика для обработки изменений ввода
    }
  };

  const handleKeyDown = (tagId: number, event: React.KeyboardEvent<HTMLElement>) => {
    switch (event.key) {
        case 'Enter':
        case 'Tab':
            const updatedTags = tags.map(tag => {
                if (tag.tag_id === tagId) {
                  let newarr = tag.tag_texts;
                  newarr.push(inputWord);
                  return { ...tag, tag_texts: newarr };
                }
                return tag;
              });
              setTags(updatedTags);
              event.preventDefault()
              //event.target
          /*setWords2((prev) => [...prev, createOption(inputWords2)]);
          setInputWords2('');
          event.preventDefault();*/
      }
    //console.log('Key down event:', event.key);
    // Ваша логика для обработки нажатий клавиш
  };


  const components = {
    DropdownIndicator: null,
  };

  return (
    <div className={mainClassnames.join(' ')}>
      {tags.map(tag => (
        <div key={tag.tag_id} className='tagCard'>
          <div className='tagOptions'>
            <span>Tag Name:</span> 
            <input 
                type="text" 
                className='tagNameInput'
                value={tag.tag_name} 
                onChange={(e) => {handleTagNameChange(tag.tag_id,e.target.value);}}
                />
            <span>Speaker:</span> 
            <input 
                type="numeric" 
                className='tagNameInput'
                value={tag.tag_spk} 
                //onChange={(e) => {setCaller(e.target.value);}}
                />
          </div>
          <CreatableSelect
            isMulti
            isClearable
            components={components}
            menuIsOpen={false}
            //inputValue={inputWord}
            value={tag.tag_texts.map(text => ({ value: text, label: text }))}
            onChange={selectedOptions => handleTagTextsChange(tag.tag_id, selectedOptions)}
            onInputChange={handleInputChange}
            onKeyDown={event => handleKeyDown(tag.tag_id,event)}
          />
          <button className='sumBTN' onClick={() => handleSaveTag(tag.tag_id)}>Сохранить</button>
        </div>
      ))}
    </div>
  );
};

export default EditableTable;
