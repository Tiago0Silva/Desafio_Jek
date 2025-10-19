export function checkAccount({ setemailExist, setpasswordCorrect, email, password, Users }) {
    const user = Users.find((user) => user.email === email);

    if (!user) {
        setemailExist(false);
        return false;
    }
    if (user.password !== password) {
        setpasswordCorrect(false);
        return false;
    }
    console.log(user.id);
    setemailExist(true);
    setpasswordCorrect(true);

    return true;
}