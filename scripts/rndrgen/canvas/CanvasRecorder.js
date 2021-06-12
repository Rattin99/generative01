// CanvasRecorder.js - smusamashah
// To record canvas effitiently using MediaRecorder
// https://webrtc.github.io/samples/src/content/capture/canvas-record/
// Tweaks Matt Perkins, hello@mattperkins.me
// - FPS option
// - more Bitrates

// https://stackoverflow.com/questions/65800159/how-do-you-determine-bitspersecond-for-media-recording
// https://support.google.com/youtube/answer/1722171?hl=en#zippy=%2Cbitrate
export const bps = {
    '4k': 40000000,
    '2k': 16000000,
    '1080p': 8000000,
    '720p': 5000000,
    '480p': 2500000,
    '360p': 1000000,
};

// BITRATE = SCREEN_SIZE_VERTICAL x SCREEN_SIZE_HORIZONTAL X FPS X PIXEL_COLOR_DEPTH

export function CanvasRecorder(canvas, fps, video_bits_per_sec) {
    this.start = startRecording;
    this.stop = stopRecording;
    this.save = download;

    let recordedBlobs = [];
    let supportedType = null;
    let mediaRecorder = null;
    const captureFPS = fps || 30;
    const captureBPS = video_bits_per_sec || bps['1080p'];

    const actualBPS = canvas.width * canvas.height * captureFPS * screen.colorDepth;

    const stream = canvas.captureStream(captureFPS);
    if (typeof stream === undefined || !stream) {
        return;
    }

    const video = document.createElement('video');
    video.style.display = 'none';

    console.log(`Canvas record, full ${actualBPS / 1000}kbps`);

    function startRecording() {
        const types = [
            'video/webm',
            'video/webm,codecs=vp9',
            'video/vp8',
            'video/webm;codecs=vp8',
            'video/webm;codecs=daala',
            'video/webm;codecs=h264',
            'video/mpeg',
        ];

        for (const i in types) {
            if (MediaRecorder.isTypeSupported(types[i])) {
                supportedType = types[i];
                break;
            }
        }
        if (supportedType == null) {
            console.log('No supported type found for MediaRecorder');
        }

        // https://w3c.github.io/mediacapture-record/MediaRecorder.html#mediarecorderoptions-section
        const options = {
            mimeType: supportedType,
            videoBitsPerSecond: captureBPS,
        };

        recordedBlobs = [];
        try {
            mediaRecorder = new MediaRecorder(stream, options);
        } catch (e) {
            console.error('MediaRecorder is not supported by this browser.');
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }

        // console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
        mediaRecorder.onstop = handleStop;
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(100); // collect 100ms of data blobs
        console.log(`MediaRecorder started at ${captureBPS / 1000}kbps, ${captureFPS}fps`);
    }

    function handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    function handleStop(event) {
        // console.log('Recorder stopped: ', event);
        const superBuffer = new Blob(recordedBlobs, { type: supportedType });
        video.src = window.URL.createObjectURL(superBuffer);
    }

    function stopRecording() {
        mediaRecorder.stop();
        // console.log('Recorded Blobs: ', recordedBlobs);
        video.controls = true;
    }

    function download(file_name) {
        const name = file_name || 'recording.webm';
        const blob = new Blob(recordedBlobs, { type: supportedType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }
}
