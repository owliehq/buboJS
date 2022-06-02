import {createRequire} from "module"
import {sequelize} from "../mock"
import {SequelizeStorage, Umzug} from "umzug";
import {URL} from 'url'

const require = createRequire(import.meta.url)
const path = new URL('.', import.meta.url).pathname
export const seeder = new Umzug({
    migrations: {
        glob: `${path}/seeds/*.ts`,
        resolve: params => {
                const getModule = () => import(`file:///${params.path.replace(/\\/g, '/')}`)
                return {
                    name: params.name,
                    path: params.path,
                    up: async upParams => (await getModule()).up(upParams),
                    down: async downParams => (await getModule()).down(downParams),
                }
            }
        },
    context: sequelize,
    storage: new SequelizeStorage({sequelize}),
    logger: console

})

export type Seeder = typeof seeder._types.migration