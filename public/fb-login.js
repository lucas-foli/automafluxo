function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
        // Usuário logado no Facebook – prosseguir para buscar dados da conta
        getBusinessAccount();
    } else {
        document.getElementById('status').innerHTML = 'Por favor, faça login no Facebook.';
    }
}

function getBusinessAccount() {
    // Primeiro, obter informações básicas do usuário (opcional)
    FB.api('/me?fields=id,name', function (userResponse) {
        const fbUserId = userResponse.id;
        // Salve o fbUserId e o nome do usuário no banco de dados
        saveUserToDatabase({
            fbUserId,
            name: userResponse.name
        });
        console.log('Logado como: ' + userResponse.name);
        document.getElementById('status').innerHTML =
            'Obrigado por fazer login, ' + userResponse.name + '!<br>';

        // Agora, buscar as páginas que o usuário administra, incluindo dados do Instagram Business Account
        FB.api('/me/accounts?fields=name,instagram_business_account', function (pagesResponse) {
            if (pagesResponse && pagesResponse.data) {
                let found = false;
                pagesResponse.data.forEach(page => {
                    if (page.instagram_business_account) {
                        console.log('Conta de Negócio do Instagram encontrada na página ' + page.name + ': ' + page.instagram_business_account.id);
                        document.getElementById('status').innerHTML +=
                            'Conta de Negócio do Instagram encontrada na página ' + page.name +
                            ': ' + page.instagram_business_account.id + '<br>';
                        found = true;
                        updateUserInstagramId(fbUserId, page.instagram_business_account.id);

                    }
                });
                if (!found) {
                    console.log('Nenhuma conta de negócio do Instagram vinculada às suas páginas foi encontrada.');
                    document.getElementById('status').innerHTML += 'Nenhuma conta de negócio do Instagram vinculada foi encontrada.<br>';
                }
            } else {
                console.error('Erro ao buscar páginas.');
                document.getElementById('status').innerHTML += 'Erro ao buscar suas páginas.<br>';
            }
        });
    });
}

function saveUserToDatabase({ fbUserId, name }) {
    localStorage.setItem('fb-creds', { id: fbUserId, name })
}

function updateUserInstagramId({ fbUserId, name }) {
    saveUserToDatabase({ fbUserId, name })
}

document.addEventListener('DOMContentLoaded', function () {
    const instagramLoginButton = document.getElementById('instagram-login');
    const authorizeButton = document.getElementById('authorize');

    instagramLoginButton.addEventListener('click', () => {
        console.log('Instagram login button clicked');
        window.location.href = 'https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=' + process.env.INSTAGRAM_CLIENT_ID + '&redirect_uri=' + process.env.INSTAGRAM_REDIRECT_URI + '&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights';
    });
    authorizeButton.addEventListener('click', () => {
        const code = window.location.href.split('code=')[1].split('#_')[0]
        console.log('Authorize button clicked');
        fetchInstagramAccessToken(code);

    })
});
const fetchInstagramAccessToken = async (code) => {
    const url = 'https://api.instagram.com/oauth/access_token';
    const baseUrl = process.env.INSTAGRAM_REDIRECT_URI;

    const formData = new URLSearchParams();
    formData.append('client_id', process.env.INSTAGRAM_CLIENT_ID);
    formData.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', baseUrl);
    formData.append('code', code);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            console.error('Error fetching access token:', error);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const longToken = await getLongAccessToken(data)
        // use('instagram_connections')
        // db.getCollection('tokens').insert({
        //     'userId': data.user_id,
        //     'shortToken': data.access_token,
        //     'longToken': longToken 
        // })
        window.alert('User connected!')
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
};

const getLongAccessToken = async (data) => {
    const url = new URL('https://graph.instagram.com/access_token')
    url.searchParams.append('grant_type', 'ig_exchange_token')
    url.searchParams.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET);
    url.searchParams.append('access_token', data.access_token)
    try {
        const response = await fetch(url)
        if (!response.ok) {
            console.error('Error fetching access token:', error);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Access Token Response:', data);

        return data;
    }
    catch (error) {
        console.error('Error fetching access token:', error);
    }
}
