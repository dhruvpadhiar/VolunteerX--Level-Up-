import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode, Send, Upload } from 'lucide-react'; // Add Upload icon
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState('');
    const [file, setFile] = useState(null); // For file upload
    const [imagePreview, setImagePreview] = useState(''); // For image preview
    const [loading, setLoading] = useState(false); // For loader state
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const { socket } = useSelector(store => store.socketio);
    const dispatch = useDispatch();

    // Create a ref for the file input
    const fileInputRef = useRef(null);

    const handleTyping = () => {
        socket.emit('typing', {
            senderId: user._id,
            receiverId: selectedUser._id,
            isTyping: textMessage.length > 4,
        });
    };

    const sendMessageHandler = async receiverId => {
        try {
            setLoading(true); // Start the loader
            const formData = new FormData();
            formData.append('textMessage', textMessage);
            formData.append('Picture', file);
            formData.append('mediaType', file ? file.type.split('/')[0] : 'text');
    
            const res = await axios.post(`http://localhost:3000/api/v1/message/send/${receiverId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
    
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage('');
                setFile(null); // Reset file state
                setImagePreview(''); // Clear image preview
                document.querySelector('input[type="file"]').value = ''; // Reset file input element
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Stop the loader
        }
    };

    // Handle file selection and show image preview
    const handleFileChange = e => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // If it's an image file, create a preview URL
        if (selectedFile && selectedFile.type.startsWith('image')) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setImagePreview(imageUrl);
        }
    };

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        };
    }, []);

    return (
        <div className='flex ml-[20%] h-screen bg-gradient-to-br from-green-50 to-green-50'>
            <section className='w-full md:w-1/4 my-8 bg-white rounded-l-2xl shadow-md'>
                <h1 className='font-bold mb-4 px-6 py-4 text-2xl text-green-800'>{user?.username}</h1>
                <hr className='mb-4 border-gray-200' />
                <div className='overflow-y-auto h-[calc(100vh-12rem)] px-2'>
                    {suggestedUsers.map(suggestedUser => {
                        const isOnline = onlineUsers.includes(suggestedUser?._id);
                        return (
                            <div
                                key={suggestedUser?._id}
                                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                                className='flex gap-4 items-center p-4 hover:bg-green-50 cursor-pointer rounded-xl transition-all duration-300 ease-in-out mb-2'
                            >
                                <Avatar className='w-12 h-12'>
                                    <AvatarImage src={suggestedUser?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col'>
                                    <span className='font-medium text-gray-800'>{suggestedUser?.username}</span>
                                    <span
                                        className={`text-xs font-bold ${isOnline ? 'text-green-500' : 'text-gray-400'}`}
                                    >
                                        {isOnline ? 'online' : 'offline'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
            {selectedUser ? (
                <section className='flex-1 bg-white rounded-r-2xl shadow-md flex flex-col h-full'>
                    <div className='flex gap-4 items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10'>
                        <Avatar className='w-10 h-10'>
                            <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                            <span className='font-medium text-green-800'>{selectedUser?.username}</span>
                        </div>
                    </div>
                    <Messages selectedUser={selectedUser} />
                    <div className='flex items-center p-4 border-t border-gray-200'>
                        <Input
                            value={textMessage}
                            onChange={e => {
                                setTextMessage(e.target.value);
                                handleTyping();
                            }}
                            type='text'
                            className='flex-1 mr-2 focus-visible:ring-green-300 bg-gray-50'
                            placeholder='Type your message...'
                        />

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="relative w-16 h-16 mr-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="object-cover w-full h-full rounded-md"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <span className="text-white text-xs">Image Loaded</span>
                                </div>
                            </div>
                        )}

<div className="flex items-center p-4 border-t border-gray-200">
    {/* Button that triggers file input */}
    <Button
        onClick={() => fileInputRef.current.click()} // Trigger file input on button click
        className='bg-green-600 hover:bg-green-700 text-white mr-2' // Add margin-right for spacing
    >
        <Upload className='w-4 h-4 mr-2' /> Upload
    </Button>

    {/* Send button */}
    <Button
        onClick={() => sendMessageHandler(selectedUser?._id)}
        className='bg-green-600 hover:bg-green-700 text-white'
    >
        {loading ? (
            <div className="spinner-border text-white" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        ) : (
            <Send className='w-4 h-4 mr-2' />
        )}
        Send
    </Button>
</div>

                    </div>
                </section>
            ) : (
                <div className='flex-1 flex flex-col items-center justify-center bg-white rounded-r-2xl shadow-md'>
                    <MessageCircleCode className='w-32 h-32 my-4 text-green-300' />
                    <h1 className='font-medium text-2xl text-green-800 mb-2'>Your messages</h1>
                    <span className='text-gray-600'>Send a message to start a chat.</span>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
