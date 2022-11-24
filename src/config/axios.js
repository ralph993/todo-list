import * as Realm from "realm-web";
import axios from "axios";
export const gql = String.raw;
export const app = new Realm.App({ id: "todo-lsit-cjrfh" });

const realmUrl = "https://us-east-1.aws.realm.mongodb.com/api/client/v2.0/app/todo-lsit-cjrfh";
const getValidAccessToken = async () => {
	const currentUser = app?.currentUser;

	if (!currentUser) {
		await app.logIn(Realm.Credentials.anonymous());
	}

	return app.currentUser.accessToken;
};

export const graphQlInstance = axios.create({
	baseURL: realmUrl,
});

graphQlInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.status === 401) {
			app.currentUser.refreshAccessToken();
			return graphQlInstance.request(error.config);
		}

		return Promise.reject(error);
	}
);

graphQlInstance.interceptors.request.use(
	async (config) => {
		const accessToken = await getValidAccessToken();
		config.headers.Authorization = `Bearer ${accessToken}`;
		return config;
	},
	(err) => Promise.reject(err)
);
