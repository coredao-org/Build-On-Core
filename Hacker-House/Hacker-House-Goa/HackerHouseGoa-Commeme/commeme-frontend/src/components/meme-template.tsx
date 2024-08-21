//@ts-nocheck
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { Button } from './ui/button'

const MemeDiv = () => {
	const [memes, setMemes] = useState([]); // for storing API response
	const [selectedMeme, setSelectedMeme] = useState({}); // for storing the randomly selected meme
	const [changeMeme, setChangeMeme] = useState(true); // To pick another meme
	const [topText, setTopText] = useState('');
	const [bottomText, setBottomText] = useState('');
	const [selectedColor, setSelectedColor] = useState('white');

	// fetch meme images on page load and until memes state array is filled
	useEffect(() => {
		if (!memes.length) {
			axios.get('https://api.imgflip.com/get_memes').then((result) => {
				if (result.data.success) {
					setMemes(result.data.data.memes);
				}
			});
		}
	}, [memes]);

	// randomly select one of the memes from state array
	useEffect(() => {
		if (memes.length) {
			const randomMeme = getRandomInt(memes.length);
			setSelectedMeme(memes[randomMeme]);
		}
	}, [memes, changeMeme]);

	// function to get random interger between 0 to max
	const getRandomInt = (max) => {
		const value = Math.floor(Math.random() * max);
		return value;
	};

	// update state to trigger re-render with new meme image
	const handleMemeChange = (e) => {
		setChangeMeme(!changeMeme);
	};

	// handle form inputs
	const handleChange = (e) => {
		if (e.target.name === 'top_text') setTopText(e.target.value);
		else setBottomText(e.target.value);
	};

	// use html-to-image to donwload the meme div as png
	const handleDownload = (e) => {
		htmlToImage
			.toPng(document.getElementById('meme-download'))
			.then((dataUrl) => {
				download(dataUrl, `${selectedMeme.name}.png`);
			});
	};

	// change text color based on color picker
	const handleColor = (e) => {
		const color = e.target.className.split(' ')[2];
		setSelectedColor(color);
	};

	return (
		<div style={{ display: 'flex', flexFlow: 'column nowrap', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
			<div
				id='meme-download'
				style={{
					backgroundImage: `url(${selectedMeme?.url})`,
					height: `${selectedMeme?.height}px`,
					width: `${selectedMeme?.width}px`,
					display: 'flex',
					flexFlow: 'column',
					padding: 0,
					alignItems: 'center',
					justifyContent: 'space-between',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
					backgroundSize: 'contain',
					maxHeight: '50vh',
					maxWidth: '50vw',
				}}>
				<div style={{ color: selectedColor, padding: 0, fontWeight: 600, fontSize: '3rem' }} >
  {topText}
</div>

				<h2 style={{ color: selectedColor, padding: 0, fontWeight: 600,fontSize: '3rem' }} className='text-[5rem]'>
					{bottomText}
				</h2>
			</div>

			{/* display a color picker with 5 color options */}
			<div style={{ display: 'flex', width: '25%', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '1.5em' }}>
				<button
					onClick={handleColor}
					style={{
						// width: '1.2em',
						// height: '1.2em',
						border: '1px solid #505050',
						cursor: 'pointer',
						borderRadius: '2px',
						backgroundColor: 'orange',
						height: selectedColor === 'orange' ? '1.5em' : '1.2em',
						width: selectedColor === 'orange' ? '1.5em' : '1.2em',
					}}
					className='color waves-effect orange'></button>
				<button
					onClick={handleColor}
					style={{
						// width: '1.2em',
						// height: '1.2em',
						border: '1px solid #505050',
						cursor: 'pointer',
						borderRadius: '2px',
						backgroundColor: 'white',
						height: selectedColor === 'white' ? '1.5em' : '1.2em',
						width: selectedColor === 'white' ? '1.5em' : '1.2em',
					}}
					className='color waves-effect white'></button>
				<button
					onClick={handleColor}
					style={{
						// width: '1.2em',
						// height: '1.2em',
						border: '1px solid #505050',
						cursor: 'pointer',
						borderRadius: '2px',
						backgroundColor: 'black',
						height: selectedColor === 'black' ? '1.5em' : '1.2em',
						width: selectedColor === 'black' ? '1.5em' : '1.2em',
					}}
					className='color waves-effect black'></button>
				<button
					onClick={handleColor}
					style={{
						// width: '1.2em',
						// height: '1.2em',
						border: '1px solid #505050',
						cursor: 'pointer',
						borderRadius: '2px',
						backgroundColor: 'pink',
						height: selectedColor === 'pink' ? '1.5em' : '1.2em',
						width: selectedColor === 'pink' ? '1.5em' : '1.2em',
					}}
					className='color waves-effect pink'></button>
				<button
					onClick={handleColor}
					style={{
						// width: '1.2em',
						// height: '1.2em',
						border: '1px solid #505050',
						cursor: 'pointer',
						borderRadius: '2px',
						backgroundColor: 'yellow',
						height: selectedColor === 'yellow' ? '1.5em' : '1.2em',
						width: selectedColor === 'yellow' ? '1.5em' : '1.2em',
					}}
					className='color waves-effect yellow'></button>
			</div>

			{/* show 2 input fields */}
			<form className='w-[60%]' >
				<div className='row'>
					<div className='input-field my-3 flex flex-col'>
                    <label htmlFor='top_text'>Top Text</label>
						<input
							className='validate text-black'
							type='text'
							id='top_text'
							name='top_text'
							value={topText}
							onChange={handleChange}
						/>
						
					</div>
					<div className='input-field  my-3 flex flex-col'>
                    <label htmlFor='bottom_text'>Bottom Text</label>
						<input
							className='validate text-black'
							type='text'
							name='bottom_text'
							id='bottom_text'
							value={bottomText}
							onChange={handleChange}
						/>
						
					</div>
				</div>
			</form>

			{/* buttons for changing meme and downloading the file */}
			<div style={{ marginTop: '1rem', display: 'flex', width: '40%', justifyContent: 'space-around' }}>
				<Button
					onClick={handleMemeChange}
					
					style={{ width: '40%' }}
                    className='waves-effect waves-light btn blue '
                    >
					Change Meme
				</Button>
				<Button
					onClick={handleDownload}
					className='waves-effect waves-light btn'
					style={{ width: '40%' }}>
					Download Meme
				</Button>
			</div>
		</div>
	);
};

export default MemeDiv;
