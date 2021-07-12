const getSignedURL = () => {
  return new Promise((resolve, reject) => {
    axios
      .get('http://localhost:8100/get-signed-url')
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const uploadMediaToS3 = () => {
  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      mode: 'no-cors',
    },
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(percentCompleted);
    },
  };

  let fd = new FormData();
  fd.append('file', document.getElementById('input').files[0]);

  getSignedURL().then((data) => {
    console.log('data', data);
    axios
      .put(data.data.urls[0], fd, config)
      .then((res) => console.log('Upload Completed', res))
      .catch((err) => console.log('Upload Interrupted', err));
  });
};
