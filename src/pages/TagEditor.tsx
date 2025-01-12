import React, { useState, useEffect, useContext } from 'react';
import CreatableSelect from 'react-select';
import axios from 'axios';
import { apiUrl } from '../data/chartsData';
import { NavigationContext } from '../context/navContext';

interface Tag {
  tag_id: number;
  tag_name: string;
  tag_spk: string;
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
  const [newTag, setNewTag] = useState<Tag>({tag_id:0,tag_name:"",tag_spk:"-1",tag_texts:[]});
  const Inav = useContext(NavigationContext);
  const [inputWord, setInputWord] = useState('');


  const mainActiveClassname = Inav.navigationOpen ? 'active' : '';
  const mainClassnames = ['main','padding15', 'overflowauto', mainActiveClassname];

const updateTagList = () => {
  axios.get(`${apiUrl}backend/tags/`)
      .then(response => {console.log(response.data);setTags(response.data)})
      .catch(error => console.error(error));
}

  useEffect(() => {
    updateTagList()
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

  const handleTagSpkChange = (tagId: number, value: string) => {
    if (value) {
      const updatedTags = tags.map(tag => {
        if (tag.tag_id === tagId) {
          return { ...tag, tag_spk: value };
        }
        return tag;
      });
      setTags(updatedTags);
    }
  };

  const handleSaveTag = (tagId: number) => {
    const tagToUpdate = tags.find(tag => tag.tag_id === tagId);
    if (tagToUpdate) {
      axios.put(`${apiUrl}backend/tag/${tagId}`, tagToUpdate)
        .then(response => console.log(`Тег ${tagId} успешно сохранен`, response))
        .catch(error => console.error(`Ошибка при сохранении тега ${tagId}`, error));
    }
  };

  const handleDeleteTag = (tagId: number) => {
    axios.delete(`${apiUrl}backend/tag/${tagId}`)
        .then(response => {console.log(`Тег ${tagId} успешно удален`, response);updateTagList()})
        .catch(error => console.error(`Ошибка при сохранении тега ${tagId}`, error));
    }
  

  const handleCreateTag = () => {
    const tagToUpdate = newTag
    if (tagToUpdate) {
      axios.post(`${apiUrl}backend/tag/`, tagToUpdate)
        .then(response => {console.log(`Тег ${tagToUpdate.tag_id} успешно сохранен`, response); updateTagList()})
        .catch(error => console.error(`Ошибка при сохранении тега ${tagToUpdate.tag_id}`, error));
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

  const handleKeyDownNew = (event: React.KeyboardEvent<HTMLElement>) => {
    switch (event.key) {
        case 'Enter':
        case 'Tab':
              let newarr = newTag.tag_texts;
              newarr.push(inputWord);
              setNewTag({ ...newTag, tag_texts: newarr });
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
                type="text" 
                className='tagNameInput'
                value={tag.tag_spk} 
                onChange={(e) => {handleTagSpkChange(tag.tag_id,e.target.value);}}
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
          <button className='sumBTN deleteBTN' onClick={() => handleDeleteTag(tag.tag_id)}>Удалить</button>
        </div>
      ))}

        <div key="0" className='tagCard'>
          <div className='tagOptions'>
            <span>Tag Name:</span> 
            <input 
                type="text" 
                className='tagNameInput'
                value={newTag.tag_name} 
                onChange={(e) => {setNewTag({ ...newTag, tag_name: e.target.value })}}
                />
            <span>Speaker:</span> 
            <input 
                type="numeric" 
                className='tagNameInput'
                value={newTag.tag_spk} 
                //onChange={(e) => {setCaller(e.target.value);}}
                />
          </div>
          <CreatableSelect
            isMulti
            isClearable
            components={components}
            menuIsOpen={false}
            //inputValue={inputWord}
            value={newTag.tag_texts.map(text => ({ value: text, label: text }))}
            onChange={selectedOptions => {newTag.tag_texts=selectedOptions.map(option => option.value); setNewTag(newTag)}}
            onInputChange={handleInputChange}
            onKeyDown={event => handleKeyDownNew(event)}
          />
          <button className='sumBTN' onClick={() => handleCreateTag()}>Создать</button>
        </div>

    </div>
  );
};

export default EditableTable;
