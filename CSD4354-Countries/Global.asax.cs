using CSD4354_Countries.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Validation;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace CSD4354_Countries
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            SqlProviderServices.SqlServerTypesAssemblyName =
                "Microsoft.SqlServer.Types, Version=14.0.0.0";
            SqlServerTypes.Utilities.LoadNativeAssemblies
                (Server.MapPath("~/bin"));            
        }
    }

    
}
