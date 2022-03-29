let jwt;

const signUpUrl = 'http://localhost:3000/signup';
const url4 = 'http://localhost:3000/admin/global-data';
const putGlobalDataUrl = 'http://localhost:3000/admin/global-data';
const url2 = 'http://localhost:3000/login';
const adminHomeUrl = 'http://localhost:3000/admin/joes-site';
const putHomePage = 'http://localhost:3000/admin/joes-site';

const herokuSignUp = 'https://cms-societies.herokuapp.com/signup';
const herokuLogin = 'https://cms-societies.herokuapp.com/login';
const herokuGetGlobalData =
  'https://cms-societies.herokuapp.com/admin/global-data';
const herokuPutGlobalData =
  'https://cms-societies.herokuapp.com/admin/global-data';

// const signUp = () => {
//   fetch(signUpUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       username: 'Joe',
//       password: '123456',
//       confirmPassword: '123456',
//       url: '/joes-site',
//       siteName: "Joe's Site",
//     }),
//   })
//     .then((result) => result.json())
//     .then((result) => console.log(result));
// };

// signUp();

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
    // putGlobalData();
    // getGlobalData();
    // createHome();
    // getHome();
    updateHome();
    getHome();
  })
  .catch((err) => console.log(err));

const getGlobalData = () => {
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

const createHome = () => {
  fetch(adminHomeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt.toString(),
    },
    body: JSON.stringify({
      name: 'Joes Home',
    }),
  })
    .then((result) => result.json())
    .then((result) => console.log(result));
};

const getHome = () => {
  fetch(adminHomeUrl, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + jwt.toString(),
    },
  })
    .then((result) => result.json())
    .then((result) => console.log(result));
};

const updateHome = () => {
  fetch(putHomePage, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + jwt.toString(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contentTemplates: [
        'This is some content here',
        'Here is some more content',
      ],
      name: 'Joes Home Page',
    }),
  })
    .then((result) => result.json())
    .then((result) => console.log(result));
};

const createPage = () => {
  fetch('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt.toString(),
    },
    body: JSON.stringify({
      name: 'Contact Page',
      contentTemplates: ['This is some content', 'More content here'],
    }),
  });
};

const getPage = () => {
  fetch('', {});
};
