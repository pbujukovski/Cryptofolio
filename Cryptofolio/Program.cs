using Binance.Net.Clients;
using Binance.Net.Objects;
using CryptoExchange.Net.Authentication;
using Cryptofolio.Data;
using Cryptofolio.Email.Services;
using Cryptofolio.Models;
using Cryptofolio.Services;
using Cryptofolio.ViewModels;
using Hangfire;
using Hangfire.SqlServer;
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

var fromEmail = builder.Configuration.GetValue<string>("Email:Sendgrid:FromEmail");

var sendgridEmailKey = Environment.GetEnvironmentVariable("CRYPTOFOLIO_SENDGRID_API_KEY");

builder.Services
               .AddFluentEmail(fromEmail)
               .AddRazorRenderer(Directory.GetCurrentDirectory())
               .AddSendGridSender(sendgridEmailKey);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddControllersWithViews()
    .AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);

builder.Services.AddHangfire(configuration => configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UseSqlServerStorage(builder.Configuration.GetConnectionString("Hangfire"), new SqlServerStorageOptions
        {
            CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
            SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
            QueuePollInterval = TimeSpan.Zero,
            UseRecommendedIsolationLevel = true,
            DisableGlobalLocks = true
        }));

// Add the processing server as IHostedService
builder.Services.AddHangfireServer();

builder.Services.AddScoped<IBackgroundJobClient>(sp => new BackgroundJobClient(JobStorage.Current));


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
builder.Services.AddScoped(options =>
{
    var binanceOptions = new BinanceClientOptions()
    {
        ApiCredentials = new ApiCredentials(
                        key: "5NN39zgBACmjHRQztBD1mFaEAv8Tn97dUcZ6k3m8eaLvThwFvB6VzRkSX3XBIEJc",
            secret: "eM9zxQ8KMSXOOD4zttPRK3V2PSE9gKr8fpC6ylZRkgkO7cEcp0scVzsXwC6eeL3V"
            )
    };

    var client = new BinanceClient(binanceOptions);

    return client;
});

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ICryptoNotifierService, CryptoNotifierService>();



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

DashboardOptions options = new DashboardOptions
{
    DashboardTitle = "Cryptofolio Hangfire",
    IgnoreAntiforgeryToken = true
};

app.UseHangfireDashboard("/hangfire", options);

/*
app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());*/
app.UseCors();
app.UseMvc();
app.UseStaticFiles();

RecurringJobService.StartRecurringBackgroundJobs();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapRazorPages();

app.MapFallbackToFile("index.html");

app.Run();
