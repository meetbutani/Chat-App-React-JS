import React, { useState, useRef, useEffect } from 'react'

import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faXmark } from '@fortawesome/free-solid-svg-icons';
import userImg from '../../images/user-cropped.svg'

import axios from 'axios';

import 'react-image-crop/dist/ReactCrop.css'
import './ProfileImage.scss'

const ProfileImage = ({ uploadUrl, avatar, fileName }) => {

    const [profileImageSrc, setProfileImageSrc] = useState(avatar ? fileName : '')
    const [imgSrc, setImgSrc] = useState('')
    const previewCanvasRef = useRef(null)
    const imgRef = useRef(null)
    const profileImg = useRef(null)
    const changeImg = useRef(null)
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState()
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState(1) // 16/9

    useEffect(() => {
        setProfileImageSrc(fileName);
    }, [profileImageSrc, fileName]); // Run the effect whenever profileImageSrc changes

    function onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined) // Makes crop preview update between images.
            const reader = new FileReader()
            reader.addEventListener('load', () =>
                setImgSrc(reader.result?.toString() || ''),
            )
            reader.readAsDataURL(e.target.files[0])
        }
    }

    function onImageLoad(e) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    scale,
                    rotate,
                )
            }
        },
        100,
        [completedCrop, scale, rotate],
    )

    function handelPopupClose() {
        changeImg.current.value = ''
        setImgSrc('');
    }

    async function handelUploadClick() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const maxImageSize = 200;

            canvas.width = maxImageSize;
            canvas.height = maxImageSize;

            const imageData = previewCanvasRef.current.toDataURL('image/jpeg');
            const img = new Image();
            img.src = imageData;

            await new Promise((resolve, reject) => {
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, maxImageSize, maxImageSize);
                    canvas.toBlob(resolve, 'image/jpeg', 1);
                };
                img.onerror = reject;
            });

            const response = await axios.post(uploadUrl, {
                image: canvas.toDataURL('image/jpeg', 1),
                fileName: fileName,
            });

            if (response.data["uploaded"]) {
                setProfileImageSrc(undefined);
                // console.log('Image uploaded:', response.data);
            }
        } catch (error) {
            console.error('Error resizing and uploading image:', error);
        }

        handelPopupClose()
    }

    return (
        <>
            <div className='profile-img-div'>
                <div className='img'>
                    <img className='profile-img' ref={profileImg}
                        src={profileImageSrc ? 'http://localhost:3001/uploads/profile-image/' + profileImageSrc + '.jpg?cache=' + Math.random() : userImg}
                        alt='' />
                    <div className='change-img'>
                        <label htmlFor={"change-img"}><FontAwesomeIcon icon={faArrowUpFromBracket} style={{ color: "#D3D3D3" }} /></label>
                        <input ref={changeImg} id='change-img' type="file" accept="image/*" onChange={onSelectFile} />
                    </div>
                </div>
                {!!imgSrc && (
                    <div className='image-crop-popup'>
                        <div className='image-crop-div'>
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspect}
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imgSrc}
                                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        </div>
                        <div className='close-popup' onClick={handelPopupClose}><FontAwesomeIcon icon={faXmark} style={{ color: "#D3D3D3" }} /></div>
                        <span className='upload-btn' onClick={handelUploadClick}>UPLOAD</span>
                    </div>
                )}
                {!!completedCrop && (
                    <canvas
                        ref={previewCanvasRef}
                        style={{
                            border: '1px solid black',
                            objectFit: 'contain',
                            // width: completedCrop.width,
                            // height: completedCrop.height,
                            maxWidth: '0px',
                            maxHeight: '0px',
                        }}
                    />
                )}
            </div>
        </>
    )
}

export default ProfileImage

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

function useDebounceEffect(fn, waitTime, deps) {
    useEffect(() => {
        const t = setTimeout(() => {
            fn.apply(undefined, deps)
        }, waitTime)

        return () => {
            clearTimeout(t)
        }
    }, deps)
}

async function canvasPreview(image, canvas, crop, scale = 1, rotate = 0) {
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('No 2d context')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    // devicePixelRatio slightly increases sharpness on retina devices
    // at the expense of slightly slower render times and needing to
    // size the image back down if you want to download/upload and be
    // true to the images natural size.
    const pixelRatio = window.devicePixelRatio
    // const pixelRatio = 1

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY

    const rotateRads = rotate * Math.PI / 180
    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2

    ctx.save()

    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY)
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY)
    // 3) Rotate around the origin
    ctx.rotate(rotateRads)
    // 2) Scale the image
    ctx.scale(scale, scale)
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight)

    ctx.restore()
}
