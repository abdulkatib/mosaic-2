import axios from 'axios';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)'
	}
};
function App() {
	const [images, setimages] = useState('');
	const [selectedImage, setSelectedImage] = useState('');
	const fetchImages = async () => {
		const { data: fetchedimages } = await axios.get('http://localhost:3005/');
		setimages(fetchedimages);
	};

	useEffect(() => {
		fetchImages();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		var formData = new FormData();
		var imagefile = document.querySelector('#file');
		formData.append('file', imagefile.files[0]);
		const { data: newImageSet } = await axios.post('http://localhost:3005/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});

		setimages(newImageSet);
	};

	const renderImages = () => {
		const imagesArr = Object.values(images);
		return imagesArr.length > 0 ? (
			imagesArr.map((image) => (
				<img
					onClick={() => setSelectedImage(image)}
					key={image}
					src={`http://localhost:3005/images/${image}`}
					style={{ width: 200, height: 200, margin: 5, borderRadius: 5, border: 'solid 1px #b2bec3' }}
				/>
			))
		) : (
			<h3>No Images uploaded yet!</h3>
		);
	};

	function closeModal() {
		setSelectedImage('');
	}

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				marginTop: 100
			}}
		>
			<Modal isOpen={selectedImage} style={customStyles}>
				<img key={selectedImage} src={`http://localhost:3005/images/${selectedImage}`} />
				<button onClick={closeModal}>close</button>
			</Modal>
			<h3>Image store</h3>
			<div>{renderImages()}</div>
			<form style={{ margin: 20 }} onSubmit={(e) => handleSubmit(e)}>
				<input type="file" name="file" id="file" />
				<input type="submit" value="Upload" />
			</form>
		</div>
	);
}

export default App;
