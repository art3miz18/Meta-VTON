import React, { useState } from 'react';
import axios from 'axios';
import { Spinner, ProgressBar, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ImageUpload = () => {
  const [personImage, setPersonImage] = useState(null);
  const [clothingImage, setClothingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [error, setError] = useState('');

  const handlePersonImageChange = (e) => {
    setPersonImage(e.target.files[0]);
  };

  const handleClothingImageChange = (e) => {
    setClothingImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!personImage || !clothingImage) {
      setError('Both images are required.');
      return;
    }
    setError('');
    setLoading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('human_image', personImage);
    formData.append('garm_image', clothingImage);
    formData.append('garment_des', 'women wearing a top');
    formData.append('is_checked', 'true');
    formData.append('is_checked_crop', 'true');
    formData.append('denoise_steps', '30');
    formData.append('seed', '42');

    try {
      const response = await axios.post('https://meta-virtualtryon.onrender.com/tryon', formData, {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          setProgress(Math.round((loaded / total) * 100));
        },
      });
      setMaskImage(response.data.mask_image);
      setResultImage(response.data.result_image);
    } catch (error) {
      console.error('Error uploading images', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <input type="file" onChange={handlePersonImageChange} />
        </Col>
        <Col>
          <input type="file" onChange={handleClothingImageChange} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <button onClick={handleUpload} className="btn btn-primary">
            Upload
          </button>
        </Col>
      </Row>
      {error && (
        <Row className="mb-4">
          <Col>
            <div className="alert alert-danger">{error}</div>
          </Col>
        </Row>
      )}
      {loading && (
        <Row className="mb-4">
          <Col>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
            <ProgressBar animated now={progress} />
          </Col>
        </Row>
      )}
      {maskImage && resultImage && (
        <Row className="mb-4">
          <Col>
            <h3>Mask Image</h3>
            <img src={maskImage} alt="Mask" className="img-fluid" />
          </Col>
          <Col>
            <h3>Result Image</h3>
            <img src={resultImage} alt="Result" className="img-fluid" />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ImageUpload;
