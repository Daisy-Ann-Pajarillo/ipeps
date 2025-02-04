import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { toast } from 'react-toastify';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Container,
    Grid2 as Grid,
    Button,
    CircularProgress,
} from '@mui/material';
import * as actions from '../../store/actions/index';
import axios from '../../axios';

const ChangeProfilePictureModal = (props) => {
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 / 1 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState("");

    const updateProfilePicture = ({ selectedFile }) => {
        let bodyFormData = new FormData();
        bodyFormData.set('user_img_file', selectedFile);
        setLoading(true);
        axios({
            method: 'post',
            auth: { username: props.auth.token },
            url: `/api/profile-page/profile-picture/update`,
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(() => {
                toast('Successfully updated profile picture');
                setLoading(false);
                setUpImg(null);
                props.onClose();
            })
            .catch((error) => {
                console.log('error', error);
                alert('Error occurred when updating profile picture');
            });
    };

    const generateDownload = (canvas, crop) => {
        if (!crop || !canvas) {
            return;
        }
        let blobFile = null;
        var file = null;
        canvas.toBlob(
            (blob) => {
                blobFile = blob;
                blobFile.lastModifiedDate = new Date();
                blobFile.name = fileName;
                file = new File([blobFile], blobFile.name, { type: "image", });
                updateProfilePicture({ selectedFile: file })
            },
            'image',
            1
        );
        return file;
    }

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setUpImg(reader.result));
            reader.readAsDataURL(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );
    }, [completedCrop]);

    return (
        <Dialog
            open={props.show}
            onClose={props.onClose}
            maxWidth="xl"
        >
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogContent>
                <Container>
                    {upImg ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <p>Crop</p>
                                <ReactCrop
                                    src={upImg}
                                    onImageLoaded={onLoad}
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    style={{ width: 250 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <p>Preview</p>
                                <div>
                                    <canvas
                                        ref={previewCanvasRef}
                                        style={{
                                            width: 250,
                                            borderSize: '20px',
                                            borderStyle: 'solid',
                                            borderColor: 'white',
                                            borderRadius: '50%',
                                        }}
                                        className='m-5'
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    ) : null}
                    <Grid container spacing={2}>
                        {!loading ? (
                            <>
                                <Grid item xs={12} md={6}>
                                    <input
                                        type='file'
                                        accept="image/*"
                                        onChange={onSelectFile}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} style={{ marginTop: 25 }}>
                                    {upImg ? (
                                        <>
                                            <Button
                                                onClick={props.onClose}
                                                style={{ marginLeft: 5, marginRight: 5 }}
                                                color='error'
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    generateDownload(previewCanvasRef.current, completedCrop);
                                                }}
                                                style={{ marginLeft: 5, marginRight: 5 }}
                                                color='primary'
                                            >
                                                Save
                                            </Button>
                                        </>
                                    ) : null}
                                </Grid>
                            </>
                        ) : (
                            <Grid item xs={12} md={12} style={{ textAlign: 'center' }}>
                                <CircularProgress />
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </DialogContent>
        </Dialog>
    );
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        isAuthenticated: state.auth.token !== null ? true : false,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onGetAuthStorage: () => dispatch(actions.getAuthStorage()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeProfilePictureModal);
