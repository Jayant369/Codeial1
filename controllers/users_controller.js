const Post = require('../models/post');
const User = require('../models/user')

// let's keep it same as before
module.exports.profile = function(req, res){

    User.findById(req.params.id, function(err, user){
        return res.render('users_profile', {
            title: "Users Profile",
            profile_user: user
        });
    });
 
}

module.exports.update = function(req, res){
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            req.flash('success', 'Details updated');
            return res.redirect('back');
        });
    }
    else{
        return res.status(401).send('Unauthorized');
    }
}

// Render the sign up page
module.exports.signUp = function(req, res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
}

// Render the sign in page
module.exports.signIn = function(req, res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
}

// Get the sign up data
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        req.flash('error', 'Password not matched');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            // console.log('error in finding user in signing up');
            // return;

            req.flash('error', 'error in finding user in signing up');
            return redirect('back');
        }

        if(!user){
            User.create(req.body, function(err, user){
                if(err){
                    // console.log('error in creating user while signing up');
                    // return;

                    req.flash('error', 'error in creating user while signing up');
                    return redirect('back');
                }

                req.flash('success', 'New user created');
                return res.redirect('/users/sign-in');
            })
        }

        else{
            req.flash('error', 'User already exists');
            return res.redirect('back');
        }
    })
}

// Sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');;
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out');
    return res.redirect('/');
}