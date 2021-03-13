import React, {useState} from 'react'
import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

//initializing the calling client and setting the token credential - creating callAgent.

// Your unique Azure Communication service endpoint
let endpointUrl = 'endpoint=https://wow-kiosk-communication.communication.azure.com/;accesskey=DUvBUIBy10hTKT6snp7OMPqw3r1Rj95MLpgrjxSoe8ka6/1QwVDDX8IMCo++qRRgN/SKLeXKiA1RMwbbtuaLbA==';

const fetchNewUser = async () => {
    const tokenURL =
        "https://wow-kiosk-tokens.azurewebsites.net/api/wow-kiosk-tokens";
    let response = await fetch(tokenURL);
    if (response.ok) {
        return response.json();
    }
};

const provisionUser = async () => {
    //fetching API object from the backend
    const userDetailResponse1 = await fetchNewUser();
    const userDetailResponse2 = await fetchNewUser();
    const userDetailResponse3 = await fetchNewUser();
    console.log(userDetailResponse1);
    console.log(userDetailResponse2);
    console.log(userDetailResponse3);
    let userID1 = userDetailResponse1.userID;
    let userID2 = userDetailResponse2.userID;
    let userID3 = userDetailResponse3.userID;
    let chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userDetailResponse1.token));
    //console.log(userID)
    async function createChatThread() {
        let createThreadRequest = {
            topic: 'Preparation for London conference',
            participants: [{
                        id: { communicationUserId: userID1 },
                        displayName: 'Jack'
                    }, {
                        id: { communicationUserId: userID2 }, //'<USER_ID_FOR_GEETA>'
                        displayName: 'Geeta'
                    }]
        };
        
        let createChatThreadResult = await chatClient.createChatThread(createThreadRequest); //provisionUser = chatClient
        let threadId = createChatThreadResult.chatThread.id;
        return threadId;
    }
    
    createChatThread().then(async threadId => {
        console.log(`Thread created:${threadId}`);
        // PLACEHOLDERS
        // <CREATE CHAT THREAD CLIENT>
        // <RECEIVE A CHAT MESSAGE FROM A CHAT THREAD>
        // <SEND MESSAGE TO A CHAT THREAD>
        // <LIST MESSAGES IN A CHAT THREAD>
        // <ADD NEW PARTICIPANT TO THREAD>
        // <LIST PARTICIPANTS IN A THREAD>
        // <REMOVE PARTICIPANT FROM THREAD>
    });
};


const Chat = () => {
    //const [userID, setUserID] = useState("UserID Here");
    //const [chatClient, setChatClient] = useState()
    //const [threadId, setThreadId] = useState()
    
    //console.log(provisionUser.userID)
    
    
    
    return (
        <React.Fragment>
           
            <button onClick={provisionUser} id="provision-user-button">
                Provision User
            </button>
        </React.Fragment>
    )
}

export default Chat
