import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    const [isTyping, setIsTyping] = useState(false);
    const { socket } = useSelector(store => store.socketio);

    useEffect(() => {
        socket?.on('typing', ({ senderId, isTyping }) => {
            if (senderId === selectedUser._id) {
                setIsTyping(isTyping);
            }
        });

        return () => {
            socket?.off('typing');
        };
    }, [socket, selectedUser]);

    const renderMedia = (mediaUrl, mediaType) => {
        if (mediaType === 'image') {
            return <img src={mediaUrl} alt="message media" className="max-w-xs rounded-md" />;
        } else if (mediaType === 'video') {
            return <video controls className="max-w-xs rounded-md"><source src={mediaUrl} type="video/mp4" /></video>;
        } else if (mediaType === 'audio') {
            return <audio controls><source src={mediaUrl} type="audio/mp3" /></audio>;
        }
        return null; // In case no media type matches
    };

    return (
        <div className="overflow-y-auto flex-1 p-4">
            <div className="flex justify-center">
                <div className="flex flex-col items-center justify-center">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{selectedUser?.username}</span>
                    <div>
                        <h2 className="font-semibold text-lg">{selectedUser?.username}</h2>
                        {isTyping && <p className="text-sm lm-10 text-green-500">Typing...</p>}
                    </div>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button className="h-8 my-2" variant="secondary">View profile</Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                {
                    messages && messages.map((msg) => {
                        return (
                            <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                    {msg.message && <p>{msg.message}</p>}
                                    {msg.mediaUrl && renderMedia(msg.mediaUrl, msg.mediaType)}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Messages
