import { Stack } from '@mui/material'
import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function Form() {
    const [selectedOption, setSelectedOption] = useState('text');
    const [selectedChoice, setSelectedChoice] = useState('text');
    const [selectedField, setSelectedField] = useState('technology');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImage1, setSelectedImage1] = useState(null);
    const [selectedImage2, setSelectedImage2] = useState(null);
    const [selectedImage3, setSelectedImage3] = useState(null);
    const [selectedImage4, setSelectedImage4] = useState(null);
    const [selectedImage5, setSelectedImage5] = useState(null);
    const selectedImages = {
        1: selectedImage1,
        2: selectedImage2,
        3: selectedImage3,
        4: selectedImage4,
    };

    const firebaseConfig = {
        apiKey: "AIzaSyBYslsNBGdOWBWDTKQDYqfmfxlF2wWm6aY",
        authDomain: "philnits-recommendation-system.firebaseapp.com",
        projectId: "philnits-recommendation-system",
        storageBucket: "philnits-recommendation-system.appspot.com",
        messagingSenderId: "179273781052",
        appId: "1:179273781052:web:37bec31b5751d7a8bd5839",
        measurementId: "G-ZJC36WWJWH"
    };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const storage = getStorage(app); // Initialize Firebase Storage using the app instance


    const handleSubmit = async () => {
        try {
            // Generate a random document name (you can use your own logic for this)
            const randomDocumentName = Math.random().toString(36).substring(7);

            // Determine the collection to use based on selectedField
            const fieldCollection = collection(
                db,
                selectedField.charAt(0).toUpperCase() + selectedField.slice(1)
            );

            // Gather form data
            const question = document.querySelector('#question').value;
            const tag = document.querySelector('#tag').value;

            // Upload figure to Firebase Storage and get download URL
            let figureURL = null;
            if (selectedOption === 'image' && selectedImage) {
                const figureRef = ref(storage, `figures/${randomDocumentName}`);
                await uploadBytes(figureRef, selectedImage);
                figureURL = await getDownloadURL(figureRef);
            }

            // Upload choices images to Firebase Storage and get download URLs
            let choiceURLs = [];
            if (selectedChoice === 'image') {
                for (let i = 1; i <= 4; i++) {
                    const image = selectedImages[i];
                    if (image) {
                        const choiceRef = ref(storage, `choices/${randomDocumentName}_${i}`);
                        await uploadBytes(choiceRef, image);
                        const choiceURL = await getDownloadURL(choiceRef);
                        choiceURLs.push(choiceURL);
                    }
                }
            } else if (selectedChoice === 'text') {
                choiceURLs = [
                    document.querySelector('#choice1').value,
                    document.querySelector('#choice2').value,
                    document.querySelector('#choice3').value,
                    document.querySelector('#choice4').value,
                ];
            }

            // Find the selected choice
            let selectedChoiceIndex = -1;
            for (let i = 1; i <= 4; i++) {
                const checkbox = document.querySelector(`#choiceImage${i}Checkbox`);
                if (checkbox && checkbox.checked) {
                    selectedChoiceIndex = i;
                    break;
                }
            }

            // Use the selected choice's URL as the answerURL
            let answerURL = "";
            if (selectedChoiceIndex !== -1) {
                answerURL = choiceURLs[selectedChoiceIndex - 1];
            }

            // Upload answer image to Firebase Storage and get download URL
            if (selectedChoice === 'image' && selectedImage5) {
                const answerRef = ref(storage, `answers/${randomDocumentName}`);
                await uploadBytes(answerRef, selectedImage5);
                answerURL = await getDownloadURL(answerRef);
            } else if (selectedChoice === 'text') {
                answerURL = document.querySelector('#answer').value;
            }

            // Create a new document in Firestore with URLs
            await addDoc(fieldCollection, {
                question,
                figure: figureURL,
                choices: choiceURLs,
                answer: answerURL,
                tag,
            });

            console.log('Document written with ID: ', randomDocumentName);

            // Clear form fields or reset form as needed
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const fieldOptions = {
        technology: [
            'Basic Theory',
            'Computer Systems',
            'Technical Elements',
            'Development Techniques',
        ],
        management: ['Project Management', 'Service Management'],
        strategy: ['System Strategy', 'Management Strategy', 'Corporate & Legal Affairs'],
    };

    const handleFieldChange = (event) => {
        setSelectedField(event.target.value);
    };

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleChoiceChange = (event) => {
        setSelectedChoice(event.target.value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const handleImage1Change = (event) => {
        const file = event.target.files[0];
        setSelectedImage1(file);
    };

    const handleImage2Change = (event) => {
        const file = event.target.files[0];
        setSelectedImage2(file);
    };

    const handleImage3Change = (event) => {
        const file = event.target.files[0];
        setSelectedImage3(file);
    };

    const handleImage4Change = (event) => {
        const file = event.target.files[0];
        setSelectedImage4(file);
    };

    const handleImage5Change = (event) => {
        const file = event.target.files[0];
        setSelectedImage5(file);
    };

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
            sx={{
                width: '100%',
            }}
        >

            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{
                    width: '100%',
                }}
            >
                <b>Field</b>
                <select name="field" id="field" onChange={handleFieldChange} value={selectedField}
                    style={{
                        width: '100%'
                    }}
                >
                    <option value="technology">Technology</option>
                    <option value="management">Management</option>
                    <option value="strategy">Strategy</option>
                </select>
            </Stack>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{
                    width: '100%',
                }}
            >
                <b>Text/Image?</b>
                <select name="imagetext" id="imagetext" onChange={handleChange} value={selectedOption}
                    style={{
                        width: '100%'
                    }}
                >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                </select>
            </Stack>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{
                    width: '100%',
                }}
            >
                <b>Question</b>
                <input type='text' placeholder='Question' id='question'
                    style={{
                        width: '100%'
                    }}
                />
            </Stack>
            {selectedOption === 'text' ? (
                <div>
                    <p>No figure</p>
                </div>
            ) : (
                <div>
                    <input type="file" accept="image/*" onChange={handleImageChange} id='figure' />
                    {selectedImage && (
                        <div>
                            <img src={URL.createObjectURL(selectedImage)} alt="Figure" />
                        </div>
                    )}
                </div>
            )}
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{
                    width: '100%',
                }}
            >
                <b>Text/Image?</b>
                <select name="imagetext" id="imagetext" onChange={handleChoiceChange} value={selectedChoice}
                    style={{
                        width: '100%'
                    }}
                >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                </select>
            </Stack>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
                spacing={2}
                sx={{
                    width: '100%',
                }}
            >
                <b>Choices</b>
                {selectedChoice === 'text' ? (
                    <div
                        sx={{
                            width: '100%',
                        }}
                    >
                        <input type='text' placeholder='Choices' id='choice1'
                            style={{
                                width: '100%'
                            }}
                        />
                        <input type='text' placeholder='Choices' id='choice2'
                            style={{
                                width: '100%'
                            }}
                        />
                        <input type='text' placeholder='Choices' id='choice3'
                            style={{
                                width: '100%'
                            }}
                        />
                        <input type='text' placeholder='Choices' id='choice4'
                            style={{
                                width: '100%'
                            }}
                        />
                    </div>
                ) : (
                    <div
                        sx={{
                            width: '100%',
                        }}
                    >
                        <input type="file" accept="image/*" onChange={handleImage1Change} id='choiceImage1' />
                        {selectedImage1 && (
                            <div>
                                <img src={URL.createObjectURL(selectedImage1)} alt="Choice 1" />
                            </div>
                        )}
                        <input type="checkbox" id='choiceImage1Checkbox' />
                        <input type="file" accept="image/*" onChange={handleImage2Change} id='choiceImage2' />
                        {selectedImage2 && (
                            <div>
                                <img src={URL.createObjectURL(selectedImage2)} alt="Choice 2" />
                            </div>

                        )}
                        <input type="checkbox" id='choiceImage2Checkbox' />
                        <input type="file" accept="image/*" onChange={handleImage3Change} id='choiceImage3' />
                        {selectedImage3 && (
                            <div>
                                <img src={URL.createObjectURL(selectedImage3)} alt="Choice 3" />
                            </div>
                        )}
                        <input type="checkbox" id='choiceImage3Checkbox' />
                        <input type="file" accept="image/*" onChange={handleImage4Change} id='choiceImage4' />
                        {selectedImage4 && (
                            <div>
                                <img src={URL.createObjectURL(selectedImage4)} alt="Choice 4" />
                            </div>
                        )}
                        <input type="checkbox" id='choiceImage4Checkbox' />
                    </div>
                )}

            </Stack>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
                spacing={2}
                sx={{
                    width: '100%',
                }}
            >
                <b>Answer</b>
                {selectedChoice === 'text' ? (
                    <div
                        sx={{
                            width: '100%',
                        }}
                    >
                        <input type='text' placeholder='Answer' id='answer'
                            style={{
                                width: '100%'
                            }}
                        />
                    </div>
                ) : (
                    <div
                        sx={{
                            width: '100%',
                        }}
                    >
                        <input type='text' placeholder='Answer' id='answer' disabled
                            style={{
                                width: '100%'
                            }}
                        />
                    </div>
                )}

            </Stack>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{
                    width: '100%',
                }}
            >
                <b>Tag</b>
                <select name="tag" id="tag"
                    style={{
                        width: '100%'
                    }}
                >
                    {fieldOptions[selectedField].map((tag, index) => (
                        <option key={index} value={tag} id='tag'>
                            {tag}
                        </option>
                    ))}
                </select>
            </Stack>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{
                    width: '100%',
                }}
            >
                <button onClick={handleSubmit}>Submit</button>
            </Stack>
        </Stack>
    )
}

export default Form