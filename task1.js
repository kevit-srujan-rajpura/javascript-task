fetch("https://reqres.in/api/users?page=1&&per_page=15")
    .then((data) => {
        return data.json();
    })
    .then((objectData) => {
        let tableData = "";
        objectData.data.map((data) => {
            tableData += `<tr> <td><img id="img-avatar"  src="${data.avatar}"/></td><td>${data.first_name}</td><td>${data.last_name}</td></tr>`;
        });
        document.getElementById("tbody").innerHTML = tableData;
    });


// or
//  ** With async-await **


// async function getData() {
//     try {
//         const response = await fetch('https://reqres.in/api/users?page=1&per_page=15');
//         const objdata = await response.json();

//         let tab = "";
//         objdata.data.forEach((data) => {
//             tab += `<tr>
//                 <td><img id="img-avatar" src="${data.avatar}" alt="Avatar"/></td>
//                 <td>${data.first_name}</td>
//                 <td>${data.last_name}</td>
//                 </tr>`;
//         });

//         document.getElementById('tbody').innerHTML = tab;
//     } catch (error) {
//         console.error(error);
//     }
// }
// getData();
