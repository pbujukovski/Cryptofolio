using Cryptofolio.Data;
using Cryptofolio.Models;
using Cryptofolio.Services;
using Cryptofolio.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;

namespace Cryptofolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotifiersController : ODataController
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserAuthService _userAuthService;

        public NotifiersController(ApplicationDbContext context, IUserAuthService userAuthService)
        {
            _context = context;
            _userAuthService = userAuthService;
        }

        // GET: api/Notifiers
        [EnableQuery]
        [HttpGet("/odata/Notifiers")]
        public ActionResult<List<NotifierDTO>> GetNotifiers()
        {
            if (_context.Notifiers == null && _userAuthService.getCurrentUserId() == null)
            {
                return NotFound();
            }
            else if (_context.Notifiers != null && _userAuthService.getCurrentUserId() != null)
            {
                List<NotifierDTO> notifiers = _context.Notifiers.Where(cs => cs.ApplicationUserId == _userAuthService.getCurrentUserId()).Include(c => c.ApplicationUser).Select(notifiers => new NotifierDTO(notifiers)).ToList();
                return Ok(notifiers);
            }
            else return BadRequest();
        }

        // GET: api/Notifiers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Notifier>> GetNotifier(int id)
        {
            if (_context.Notifiers == null)
            {
                return NotFound();
            }
            var notfier = await _context.Notifiers.FindAsync(id);

            if (notfier == null)
            {
                return NotFound();
            }

            return notfier;
        }

        // PUT: api/Notifiers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotifier(int id, [FromODataBody] NotifierDTO notifierDTO)
        {
            Notifier? notifier = await _context.Notifiers?.FirstOrDefaultAsync(x => x.Id == id);

            if (notifier == null)
            {
                if (id != notifier.Id)
                {
                    return BadRequest();
                }
                notifier.Id = notifierDTO.Id;
                notifier.DesiredPrice = notifierDTO.DesiredPrice;
                notifier.DueDate = notifierDTO.DueDate;
                notifier.CoinSymbol = notifierDTO.CoinSymbol;
                notifier.ApplicationUserId = notifierDTO.ApplicationUserId;

                _context.Entry(notifier).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!NotifierExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

            }
            return NoContent();
        }

        [HttpPatch("{key}")]
        public async Task<IActionResult> Patch([FromODataUri] int key, Delta<NotifierDTO> notifierDTO)
        {
            if (_context.Notifiers == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Notifiers'  is null.");
            }
            if (_userAuthService.getCurrentUserId() is null)
            {
                return Problem("Access denied");
            }

            var entity = await _context.Notifiers.FindAsync(key);

            if (entity == null)
            {
                return NotFound();
            }


            Delta<Notifier> deltaNotifier = NotifierDTO.toDeltaNotifier(notifierDTO);

            deltaNotifier.Patch(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NotifierExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Updated(entity);

        }

        // POST: api/Notifiers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPost("/odata/Notifiers")]
        public async Task<ActionResult<Notifier>> PostNotifier(NotifierDTO notifierDTO)
        {
            if (_context.Notifiers == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Notifiers'  is null.");
            }

            else if (_userAuthService.getCurrentUserId() != null)
            {
                Coin coins = _context.Coins.Find(notifierDTO.CoinSymbol.ToString());

                if (coins == null)
                {
                    Coin coin = new Coin();

                    coin.Symbol = notifierDTO.CoinSymbol.ToString();

                    _context.Coins.Add(coin);
                    await _context.SaveChangesAsync();
                }


                Notifier notifier = notifierDTO.convertToNotifier();
                //TODO: Add IDs based on claims


                notifier.ApplicationUserId = _userAuthService.getCurrentUserId();
                notifier.Id = 0;
  
                _context.Notifiers.Add(notifier);
                await _context.SaveChangesAsync();

                notifierDTO.Id = notifier.Id;
                notifierDTO.ApplicationUserId = notifier.ApplicationUserId;
                notifierDTO.DesiredPrice = notifier.DesiredPrice;
                notifierDTO.DueDate = notifier.DueDate;
                notifierDTO.CoinSymbol = notifier.CoinSymbol;
                return CreatedAtAction("GetNotifier", new { id = notifierDTO.Id }, notifierDTO);
            }
            else
            {
                return BadRequest();
            }
        }

        // DELETE: api/Notifiers/5
        [EnableQuery]
        [HttpDelete("/odata/Notifiers({id})")]
        public async Task<IActionResult> DeleteNotifier(int id)
        {
            if (_context.Notifiers == null)
            {
                return NotFound();
            }
            var notifier = await _context.Notifiers.FindAsync(id);
            if (notifier == null)
            {
                return NotFound();
            }

            _context.Notifiers.Remove(notifier);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NotifierExists(int id)
        {
            return (_context.Notifiers?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
