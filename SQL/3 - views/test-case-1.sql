set statistics time on
set statistics io on

-- Username and HashedPassword are login credentials and can be omitted when retrieving user info.
SELECT Users.UserId, Users.Email, Users.Firstname, Users.Lastname FROM dbo.Users as users
WHERE users.UserId = 100

set statistics time off
set statistics io off
