let jwt;

const url4 = 'http://localhost:3000/admin/global-data';
const putGlobalDataUrl = 'http://localhost:3000/admin/global-data';
const url2 = 'http://localhost:3000/login';

const herokuLogin = 'https://cms-societies.herokuapp.com/login';
const herokuGetGlobalData =
  'https://cms-societies.herokuapp.com/admin/global-data';
const herokuPutGlobalData =
  'https://cms-societies.herokuapp.com/admin/global-data';

fetch(herokuLogin, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'Joe',
    password: '123456',
  }),
})
  .then((result) => {
    return result.json();
  })
  .then((result) => {
    jwt = result.token;
    console.log(jwt);
    putGlobalData();
    requestTwo();
  })
  .catch((err) => console.log(err));

const requestTwo = () => {
  fetch(herokuGetGlobalData, {
    headers: {
      Authorization: 'Bearer ' + jwt.toString(),
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
};

const putGlobalData = () => {
  fetch(herokuPutGlobalData, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + jwt.toString(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      header: {
        logoUrl:
          'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-674010.jpg&fm=jpg',
        backgroundColor: '#eaeaea',
      },
      nav: {
        links: ['byui.edu', 'lds.org'],
      },
      footer: {
        contact: '503-270-8563',
        socialLinks: {
          facebook: 'facebook.com',
          iBelong: 'https://ibelong.byui.edu/',
          instagram: 'instagram.com',
        },
      },
    }),
  }).then((result) => console.log(result));
};
