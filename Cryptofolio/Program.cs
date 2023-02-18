using Cryptofolio.Data;
using Cryptofolio.Models;
using Cryptofolio.Services;
using Cryptofolio.ViewModels;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;

static IEdmModel GetEdmModel()
{
    var builder = new ODataConventionModelBuilder();

    var coinDTO = builder.EntitySet<CoinDTO>("Coins");
    var commentDTO = builder.EntitySet<CommentDTO>("Comments");
    var watchlistDTO = builder.EntitySet<WatchlistDTO>("Watchlists");
    var votingHistoryDTO = builder.EntitySet<VotingHistoryDTO>("VotingHistories");
    var transactionDTO = builder.EntitySet<TransactionDTO>("Transactions");
    var financeTrancationDTO = builder.EntitySet<FinanceTransactionDTO>("FinanceTransactions");
    var financeTrancationBuyDTO = builder.EntitySet<FinanceTransactionBuyDTO>("FinanceTransactionBuys");
    var financeTrancationSellDTO = builder.EntitySet<FinanceTransactionSellDTO>("FinanceTransactionSells");
    var transferTrancationDTO = builder.EntitySet<TransferTransactionDTO>("TransferTransactions");
    var transferTrancationInDTO = builder.EntitySet<TransferTransactionInDTO>("TransferTransactionIns");
    var transferTrancationOutDTO = builder.EntitySet<TransferTransactionOutDTO>("TransferTransactionOuts");
    var notifierDTO = builder.EntitySet<NotifierDTO>("Notifiers");
    return builder.GetEdmModel();
}
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddControllersWithViews()
    .AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);

builder.Services.AddControllers()
    .AddOData(options => options
    .Select()
    .Filter()
    .Expand()
    .SetMaxTop(100)
    .Count()
    .OrderBy()
    .AddRouteComponents("odata", GetEdmModel())

    );

builder.Services.AddScoped<IUserAuthService, UserAuthService>();

/*builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();*/

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddDefaultTokenProviders()
    .AddDefaultUI()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();


builder.Services.AddIdentityServer()
    .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

builder.Services.AddAuthentication()
    .AddIdentityServerJwt();

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();


builder.Services.AddCors(o => o.AddPolicy("AllowAllOrigins", builder =>
{
    builder.AllowAnyOrigin()
   .AllowAnyMethod()
   .AllowAnyHeader();
}));

builder.Services.AddMvc(m => m.EnableEndpointRouting = false);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseIdentityServer();
app.UseAuthorization();
/*
app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());*/
app.UseCors();
app.UseMvc();
app.UseStaticFiles();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapRazorPages();

app.MapFallbackToFile("index.html");

app.Run();
