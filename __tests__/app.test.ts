import { User } from "../src/Models/User";
import { UserRelation } from "../src/Models/UserRelation";

describe("App funcionando", () => {
    afterAll(async () => {
        await User.destroy({
            where: {},
            truncate: true
        });

        await UserRelation.destroy({
            where: {},
            truncate: true
        });
    });

    test("Test", () => {
        expect(1 + 1).toBe(2);
    });
});