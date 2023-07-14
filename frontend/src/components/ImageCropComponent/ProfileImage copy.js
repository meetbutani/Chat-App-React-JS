import React, { useState, useRef, useEffect } from 'react'

import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faXmark } from '@fortawesome/free-solid-svg-icons';
import userImg from '../../images/user-cropped.svg'

import 'react-image-crop/dist/ReactCrop.css'
import './ProfileImage.scss'

const ProfileImage = () => {

    const [imgSrc, setImgSrc] = useState('')
    const previewCanvasRef = useRef(null)
    const imgRef = useRef(null)
    const hiddenAnchorRef = useRef(null)
    const blobUrlRef = useRef('')
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState()
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState(1) // 16/9

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

    function onDownloadCropClick() {
        if (!previewCanvasRef.current) {
            throw new Error('Crop canvas does not exist')
        }

        previewCanvasRef.current.toBlob((blob) => {
            if (!blob) {
                throw new Error('Failed to create blob')
            }

            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current)
            }
            blobUrlRef.current = URL.createObjectURL(blob)
            hiddenAnchorRef.current.href = blobUrlRef.current
            hiddenAnchorRef.current.click()
        })
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

    function handleToggleAspectClick() {
        if (aspect) {
            setAspect(undefined)
        } else if (imgRef.current) {
            const { width, height } = imgRef.current
            setAspect(1) // 16 / 9
            setCrop(centerAspectCrop(width, height, 1)) // 16 / 9
        }
    }

    function handelPopupClose() {
        document.getElementById("change-img").value = ''
        setImgSrc('');
        // previewCanvasRef.current = null
        // imgRef.current = null
        // hiddenAnchorRef.current = null
        // blobUrlRef.current = ''
        // setCrop(null)
        // setCompletedCrop(null)
        // setScale(1)
        // setRotate(0)
        // setAspect(1)
    }

    function handelUploadClick() {

    }

    return (
        <>
            <div className='profile-img-div'>
                <img className='profile-img' src={userImg} alt='' />
                <div className='change-img'>
                    <label htmlFor={"change-img"}><FontAwesomeIcon icon={faArrowUpFromBracket} style={{ color: "#D3D3D3" }} /></label>
                    <input id='change-img' type="file" accept="image/*" onChange={onSelectFile} />
                </div>
                {/* <div className='hide'>
                    <label htmlFor="scale-input">Scale: </label>
                    <input
                        id="scale-input"
                        type="number"
                        step="0.1"
                        value={scale}
                        disabled={!imgSrc}
                        onChange={(e) => setScale(Number(e.target.value))}
                    />
                </div>
                <div className='hide'>
                    <label htmlFor="rotate-input">Rotate: </label>
                    <input
                        id="rotate-input"
                        type="number"
                        value={rotate}
                        disabled={!imgSrc}
                        onChange={(e) =>
                            setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
                        }
                    />
                </div>
                <div className='hide'>
                    <button onClick={handleToggleAspectClick}>
                        Toggle aspect {aspect ? 'off' : 'on'}
                    </button>
                </div> */}
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
            </div>
            {/* <div className="ImageCrop">
                {!!completedCrop && (
                    <>
                        <div>
                            <canvas
                                ref={previewCanvasRef}
                                style={{
                                    border: '1px solid black',
                                    objectFit: 'contain',
                                    // width: completedCrop.width,
                                    // height: completedCrop.height,
                                    maxWidth: '100px',
                                    maxHeight: '100px',
                                }}
                            />
                        </div>
                        <div>
                            <button onClick={onDownloadCropClick}>Download Crop</button>
                            <a
                                ref={hiddenAnchorRef}
                                download
                                style={{
                                    position: 'absolute',
                                    top: '-200vh',
                                    visibility: 'hidden',
                                }}
                            >
                                Hidden download
                            </a>
                        </div>
                    </>
                )}
            </div> */}
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
