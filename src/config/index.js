import process from 'node:process'
import development from './development.dist.js'
import production from './production.dist.js'


const getConfig = () => {
	const env = process.env.NODE_ENV || 'development'

	const equivalences = {
		development,
		production
	}

    return equivalences[env];
}

export default getConfig();