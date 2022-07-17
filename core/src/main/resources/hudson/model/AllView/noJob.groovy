package hudson.model.AllView

import hudson.model.Computer
import hudson.model.Item
import hudson.model.Job
import jenkins.model.Jenkins

def l = namespace(lib.LayoutTagLib)

def isTopLevelAllView = my.owner == Jenkins.get();
def canSetUpDistributedBuilds = Jenkins.get().hasPermission(Computer.CREATE) &&
        Jenkins.get().clouds.isEmpty() &&
        Jenkins.get().getNodes().isEmpty();
def hasAdministerJenkinsPermission = Jenkins.get().hasPermission(Jenkins.ADMINISTER);
def hasItemCreatePermission = my.owner.itemGroup.hasPermission(Item.CREATE);

div(class: "app-dashboard__oobe") {
        if (isTopLevelAllView) {
            if (canSetUpDistributedBuilds || hasItemCreatePermission) {
                h1 {
                    span(_("Welcome to"))
                    span("Jenkins", class: "elaine")
                }

                p(_("noJobDescription"), class: "jenkins-leading-description")
                
                section(class: "empty-state-section") {
                    h2(_("startBuilding"), class: "empty-state-section__heading")

                    ul(class: "empty-state-section-list") {
                        li(class: "content-block") {
                            a(href: "newJob", class: "jenkins-button content-block__link") {
                                span(_("createJob"))
                                l.icon(src: "symbol-arrow-right")
                            }
                        }
                    }
                }

                if (canSetUpDistributedBuilds) {
                    section(class: "empty-state-section") {
                        h2(_("setUpDistributedBuilds"), class: "empty-state-section__heading")
                        ul(class: "empty-state-section-list") {
                            li(class: "content-block") {
                                a(href: "computer/new", class: "jenkins-button content-block__link") {
                                    span(_("setUpAgent"))
                                    l.icon(src: "symbol-arrow-right")
                                }
                            }

                            if (hasAdministerJenkinsPermission) {
                                li(class: "content-block") {
                                    a(href: "configureClouds", class: "jenkins-button content-block__link") {
                                        span(_("setUpCloud"))
                                        l.icon(src: "symbol-arrow-right")
                                    }
                                }
                            }

                            li(class: "content-block") {
                                a(href: "https://www.jenkins.io/redirect/distributed-builds",
                                        target: "_blank",
                                        class: "jenkins-button content-block__link") {
                                    span(_("learnMoreDistributedBuilds"))
                                    l.icon(src: "symbol-external")
                                }
                            }
                        }
                    }
                }

            }
        } else if (hasItemCreatePermission) {
            // we're in a folder

            section(class: "empty-state-section") {
                h2(_("This folder is empty"), class: "empty-state-section__heading")

                ul(class: "empty-state-section-list") {
                    li(class: "content-block") {
                        a(href: "newJob", class: "jenkins-button content-block__link") {
                            span(_("createJob"))
                            l.icon(src: "symbol-arrow-right")
                        }
                    }
                }
            }
        }

        // If the user is logged out
        if (h.isAnonymous() && !hasItemCreatePermission) {
            def canSignUp = app.securityRealm.allowsSignup()

            h1(_("Welcome to Jenkins!"))

            if (canSignUp) {
                p(_("anonymousDescriptionSignUpEnabled"))
            } else {
                p(_("anonymousDescription"))
            }

            section(class: "empty-state-section") {
                ul(class: "empty-state-section-list") {
                    li(class: "content-block") {
                        a(href: "${rootURL}/${app.securityRealm.loginUrl}?from=${request.requestURI}",
                                class: "jenkins-button content-block__link") {
                            span(_("Log in to Jenkins"))
                            l.icon(src: "symbol-arrow-right")
                        }
                    }

                    if (canSignUp) {
                        li(class: "content-block") {
                            a(href: "signup", class: "jenkins-button content-block__link") {
                                span(_("Sign up for Jenkins"))
                                l.icon(src: "symbol-arrow-right")
                            }
                        }
                    }
                }
            }
        }
    }
