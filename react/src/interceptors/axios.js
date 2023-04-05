import axios from "axios";
let refresh = false;
axios.interceptors.response.use(resp => resp, async error => {
  if (error.response.status === 401 && !refresh) {
     refresh = true;
     console.log(localStorage.getItem('refresh_token'))
     const response = await   
           axios.post('http://127.0.0.1:8000/token/refresh/', 
                      {refresh:localStorage.getItem('refresh_token')},
                      {headers: {'Content-Type': 'application/json'}},
                      {withCredentials: true}
                      );
    if (response.status === 200) {
      console.log(response.data);
      let access_token = response.data.access;
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      console.log(axios.defaults.headers.common['Authorization']);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      return axios(error.config);
  }
  }
refresh = false;
return error;
});