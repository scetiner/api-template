const snippet = `
/**
 * @jest-environment node
 */
jest.setTimeout(60000);
global.console = {
    log: jest.fn(),
    error: jest.fn()
}

const axios = require('axios');
const {to} = require('await-to-js');


describe("__nameCapital__ API test", async () => {
    const app = require('../../../app');
    const service = axios.create({
        auth: {
          username: global.conf.authentication.admin.username,
          password: global.conf.authentication.admin.password
        }
      });
    const path = "http://localhost:"+ global.conf.listenPort +"/api/v1.0/__nameLowerCase__";
    let __nameLowerCase___id = "";
    throw new Error("Not implemented entity model");
    // const __nameLowerCase__ = {
    //     name: "john doe",
    //     email: "john.doe@email.com",
    //     age: 34
    // };
    
    afterAll(async done => {
        app.express_server.close();
        done();
    });

    test("POST /__nameLowerCase__", async done => {
        const [err, result] = await to(service.post(path, __nameLowerCase__));   
        
        expect(err).toBeNull();
        expect(result.status).toBe(200);
        expect(result.data.status).toBe("created");
        expect(result.data.entity).toBe("__nameLowerCase__");
        expect(result.data.id).not.toBeNull();
        __nameLowerCase___id = result.data.id;
        done();
    });


    test("GET /__nameLowerCase__:id", async done => {        
        const [err, result] = await to(service.get(\`\${ path }/\${__nameLowerCase___id}\`));        
        expect(err).toBeNull();
        expect(result.status).toBe(200);
        expect(result.data).not.toBeNull();
        expect(result.data.id).toBe(__nameLowerCase___id)
        throw new Error("Not implemented read fields");
        done();
    });

    test("PUT /__nameLowerCase__:id", async done => {
        throw new Error("Not implemented update fields");        
        // __nameLowerCase__.name = "jane doe";
        // __nameLowerCase__.email = "jane.doe@email.com";
        // __nameLowerCase__.age = 32;
        

        const [err, result] = await to(service.put(\`\${path}/\${__nameLowerCase___id}\`, __nameLowerCase__));   
        expect(err).toBeNull();
        expect(result.status).toBe(200);
        expect(result.data).not.toBeNull();
        expect(result.data.entity).toBe("__nameLowerCase__");
        expect(result.data.id).toBe(__nameLowerCase___id);
        expect(result.data.status).toBe("updated");
        done();
    });

    test("DELETE /__nameLowerCase__:id", async done => {
        const [err, result] = await to(service.delete(\`\${path}/\${__nameLowerCase___id}\`));
        expect(err).toBeNull();
        expect(result.status).toBe(200);
        expect(result.data).not.toBeNull();
        expect(result.data.entity).toBe("__nameLowerCase__");
        expect(result.data.id).toBe(__nameLowerCase___id);
        expect(result.data.status).toBe("deleted");
        done();
    });
});
`;

module.exports = snippet;
