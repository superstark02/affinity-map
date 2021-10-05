import axios from "axios"

export default function getFunction() {

    return new Promise((resolve, reject) => {
        var data = []
        for (var i = 0; i < 10; i++) {
            axios.get('https://dog.ceo/api/breeds/image/random')
                .then(result => {
                    data.push(result.data.message);
                    console.log(result.data.message);
                    if (data.length === 10) {
                        resolve(data);
                    }
                })
                .catch(function (error) {
                    reject(error);
                })
        }
    });
}