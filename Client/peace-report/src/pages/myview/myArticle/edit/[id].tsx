import Nav from "@/src/components/navBars/Nav";
import React, { useState, useEffect } from "react";
import { GetArticleByIdAPI, UpdateArticleAPI, DeleteArticleAPI, IArticle, IUpdateArticle } from "@/src/api";
import PublicTextInput from '@/src/components/forms/PublicTextInput';
import PublicTextArea from '@/src/components/forms/PublicTextArea';
import PublicButton from '@/src/components/buttons/PublicButton';
import RedButton from '@/src/components/buttons/RedButton';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRouter } from 'next/router';

const EditArticle: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState('');
  const [contentItems, setContentItems] = useState<{ type: 'text' | 'image', value: string | File }[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (id && storedToken) {
      const fetchArticle = async () => {
        try {
          const fetchedArticle = await GetArticleByIdAPI(id as string);
          setTitle(fetchedArticle.title);
          setContentItems(fetchedArticle.content.map(content => ({
            type: content.type as 'text' | 'image',
            value: content.value
          })));
        } catch (err) {
          setError((err as Error).message);
        }
      };

      fetchArticle();
    }
  }, [id]);

  const addTextInput = () => {
    setContentItems([...contentItems, { type: 'text', value: '' }]);
  };

  const addImageInput = () => {
    setContentItems([...contentItems, { type: 'image', value: '' }]);
  };

  const handleTextInputChange = (index: number, value: string) => {
    const newContentItems = [...contentItems];
    if (newContentItems[index].type === 'text') {
      newContentItems[index].value = value;
      setContentItems(newContentItems);
    }
  };

  const handleImageChange = (index: number, file: File) => {
    const newContentItems = [...contentItems];
    if (newContentItems[index].type === 'image') {
      newContentItems[index].value = file;
      setContentItems(newContentItems);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const newContentItems = Array.from(contentItems);
    const [movedItem] = newContentItems.splice(result.source.index, 1);
    newContentItems.splice(result.destination.index, 0, movedItem);
    setContentItems(newContentItems);
  };

  const handleDeleteItem = (index: number) => {
    const newContentItems = contentItems.filter((_, i) => i !== index);
    setContentItems(newContentItems);
  };

  const handleSubmit = async () => {
    setMessage(null);
    setError(null);

    const texts = contentItems.filter(item => item.type === 'text').map(item => item.value as string);
    const images = contentItems.filter(item => item.type === 'image' && item.value instanceof File).map(item => item.value as File);
    const imageUrls = contentItems.filter(item => item.type === 'image' && typeof item.value === 'string').map(item => item.value as string);
    const contentOrder = contentItems.map(item => item.type === 'text' ? 0 : 1);

    const updateArticle: IUpdateArticle = {
      title,
      images,
      imageUrls,
      texts,
      contentOrder
    };

    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      const response = await UpdateArticleAPI(id as string, updateArticle, token);
      setMessage("Article updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteArticle = async () => {
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      await DeleteArticleAPI(id as string, token);
      setMessage("Article deleted successfully");
      router.push('/myview'); // Redirect to another page after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Nav />
      <div className="container mx-auto mt-20 p-4 md:mt-32 md:w-2/3 lg:w-1/2 mb-24"> {/* Added mb-24 */}
        <PublicTextInput 
          id="title"
          placeholder="Article Title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="contentItems">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {contentItems.map((item, index) => (
                  <Draggable key={index} draggableId={index.toString()} index={index}>
                    {(provided) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        {...provided.dragHandleProps} 
                        className="mb-4 p-2 border border-dashed relative flex justify-between items-center"
                      >
                        {item.type === 'text' ? (
                          <PublicTextArea
                            id={`text-${index}`}
                            placeholder={`Text Input ${index + 1}`}
                            value={item.value as string}
                            onChange={(e) => handleTextInputChange(index, e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => e.target.files && handleImageChange(index, e.target.files[0])}
                            />
                            {typeof item.value === 'string' && <img src={item.value} alt={`Image ${index + 1}`} className="ml-4 h-16 w-16 object-cover" />}
                          </div>
                        )}
                        <button 
                          onClick={() => handleDeleteItem(index)}
                          className="ml-4 p-1 text-blue-500 border border-blue-500 rounded-full"
                        >
                          X
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex flex-wrap justify-between mt-4 space-y-4">
          <div className="w-full flex justify-between">
            <PublicButton text="Add Image" action={addImageInput} className="w-1/2" />
            <PublicButton text="Add Text" action={addTextInput} className="w-1/2" />
          </div>
          <div className="w-full flex justify-between">
            <RedButton text="Delete Article" action={handleDeleteArticle} className="w-1/2" />
            <PublicButton text="Update Article" action={handleSubmit} className="w-1/2" />
          </div>
        </div>

        {error && <div className="text-red-500 mt-4">{error}</div>}
        {message && <div className="text-green-500 mt-4">{message}</div>}
      </div>
    </>
  );
};

export default EditArticle;
