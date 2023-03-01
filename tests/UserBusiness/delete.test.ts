import { UserBusiness } from "../../src/business/UserBusiness"
import { DeleteUserInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("delete", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("deve deleter o usuario", async () => {
        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-admin",
            token: "token-mock-admin"
        }
        const response = await userBusiness.deleteUser(input)
        expect(response.message).toBe('usuario deletado')
    })

    test("deve disparar erro caso token nao seja uma string", async () => {
        expect.assertions(2)
        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock-admin",
                token: null
            }
    
            await userBusiness.deleteUser(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("requer token")
                expect(error.statusCode).toBe(400)
            }        
        }
    })

    test("deve disparar erro caso token seja inválido", async () => {
        expect.assertions(2)
        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock-admin",
                token: "token-mock-invalido"
            }
    
            await userBusiness.deleteUser(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("token inválido")
                expect(error.statusCode).toBe(400)
            }        
        }
    })

    test("deve disparar erro caso token nao tenha permissao para deletar", async () => {
        expect.assertions(2)
        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock-normal",
                token: "token-mock-normal"
            }
    
            await userBusiness.deleteUser(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("somente admins podem deletar contas")
                expect(error.statusCode).toBe(400)
            }        
        }
    })

    test("deve disparar erro caso o id nao exista", async () => {
        expect.assertions(1)
        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock-naoexiste",
                token: "token-mock-admin"
            }
    
            await userBusiness.deleteUser(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe("'id' não existe")
                // expect(error.statusCode).toBe(404)
            }        
        }
    })
})