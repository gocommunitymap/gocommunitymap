using BusinessLogicLayer.Repositories;
using BusinessLogicLayer.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using BusinessLogicLayer.Models;
using PresentationLayer.Controllers;
using BusinessLogicLayer.Services;
using PresentationLayer.Middleware;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddTransient<IDataAccess, DataAccess>();
builder.Services.AddScoped<IAuth, BusinessLogicLayer.Repositories.Auth>();
builder.Services.AddScoped<IEncryptionRepository, EncryptionRepository>();
builder.Services.AddScoped<IGenericRepository, GenericRepository>();
builder.Services.AddScoped<IFileServiceRepository, FileServiceRepository>();
builder.Services.AddScoped<INavbarRepository, NavbarRepository>();
builder.Services.AddScoped<ISectionRepository, SectionRepository>();
builder.Services.AddScoped<INewsRepository, NewsRepository>();
builder.Services.AddScoped<IDiscoverSectionRepository, DiscoverSectionRepository>();
builder.Services.AddScoped<ISetUsersRepository, SetUsersRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IFeaturesRepository, FeaturesRepository>();
builder.Services.AddScoped<ISetPropertiesRepository, setPropertiesRepository>();
builder.Services.AddScoped<IGlobalParametersRepository, GlobalParametersRepository>();
builder.Services.AddScoped<ICustomFeaturesRepository, CustomFeaturesRepository>();
builder.Services.AddScoped<IGuestRepository, GuestRepository>();
builder.Services.AddScoped<IIPAddressRepository, IPAddressRepository>();
builder.Services.AddScoped<IPasswordManagementRepository, PasswordManagementRepository>();
builder.Services.AddScoped<ISavedLinksRepository, SavedLinksRepository>();
builder.Services.AddScoped<IUtilitiesRepository, UtilitiesRepository>();
builder.Services.AddScoped<IUsingPlanningRepository, UsingPlanningRepository>();
builder.Services.AddScoped<IMailRepository, MailRepository>();
builder.Services.AddScoped<IChatGPTRepository, ChatGPTRepository>();
builder.Services.AddScoped<ISetRoomsRepository, SetRoomsRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IJwtExtractService, JwtExtractService>();
builder.Services.AddScoped<IHotelBookingsRepository, HotelBookingsRepository>();
builder.Services.AddSingleton<ILogService, LogService>();
builder.Services.AddScoped<IEmailTemplateSettingsRepository, EmailTemplateSettingsRepository>();
builder.Services.AddScoped<ICommunitiesRepository, CommunitiesRepository>();
builder.Services.AddScoped<IBookingCalendarRepository, BookingCalendarRepository>();

var appSettings = new AppSettings();
builder.Configuration.Bind(appSettings);
builder.Services.AddSingleton(appSettings); // <-- add this
builder.Services.AddSingleton<IAppSettingsService, AppSettingsService>();
builder.Services.AddHttpClient();

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 200 * 1024 * 1024; // 200MB
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "cors_policy",
                      builder =>
                      {
                          builder.AllowAnyMethod()
                         .AllowAnyHeader()
                         .AllowAnyOrigin();
                      });
});

var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]);
builder.Services.AddControllers();
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero,
        ValidAudience = builder.Configuration["JWT:Audience"],
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
    };
});

builder.Services.AddSwaggerGen(setup =>
{
    // Include 'SecurityScheme' to use JWT Authentication
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "JWT Authentication",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",

        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    setup.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    setup.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });

});

builder.Services.AddHttpContextAccessor(); // Allow access to HttpContext from other layers

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("cors_policy");
app.UseAuthentication();
app.UseMiddleware<JwtUserMiddleware>();
app.UseAuthorization();
app.MapControllers();

app.Run();
