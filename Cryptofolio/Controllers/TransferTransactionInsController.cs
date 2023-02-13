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
    public class TransferTransactionInsController : ODataController
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserAuthService _userAuthService;

        public TransferTransactionInsController(ApplicationDbContext context, IUserAuthService userAuthService)
        {
            _context = context;
            _userAuthService = userAuthService;
        }

        // GET: api/TransferTransactionIns
        [EnableQuery]
        [HttpGet("/odata/TransferTransactionIns")]
        public ActionResult<List<TransferTransactionInDTO>> GetTransferTransactionIns()
        {
            if (_context.TransferTransactionIns == null && _userAuthService.getCurrentUserId() == null)
            {
                return NotFound();
            }
            else if (_context.TransferTransactionIns != null && _userAuthService.getCurrentUserId() != null)
            {
                List<TransferTransactionInDTO> transferTransactionIns= _context.TransferTransactionIns.Where(cs => cs.ApplicationUserId == _userAuthService.getCurrentUserId()).Include(c => c.ApplicationUser).Select(transferTransactionIns => new TransferTransactionInDTO(transferTransactionIns)).ToList();
                return Ok(transferTransactionIns);
            }
            else return BadRequest();
        }

        // GET: api/TransferTransactionIns/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TransferTransactionIn>> GetTransferTransactionIn(int id)
        {
            if (_context.TransferTransactionIns == null)
            {
                return NotFound();
            }
            var transferTransactionIn = await _context.TransferTransactionIns.FindAsync(id);

            if (transferTransactionIn == null)
            {
                return NotFound();
            }

            return transferTransactionIn;
        }

        // PUT: api/TransferTransactionIns/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransferTransactionIn(int id, [FromODataBody] TransferTransactionInDTO transferTransactionInDTO)
        {
            TransferTransactionIn? transferTransactionIn = await _context.TransferTransactionIns.FirstOrDefaultAsync(x => x.Id == id);

            if (transferTransactionIn == null)
            {
                if (id != transferTransactionIn.Id)
                {
                    return BadRequest();
                }
                transferTransactionIn.Id = transferTransactionInDTO.Id;

                transferTransactionIn.ApplicationUserId = transferTransactionInDTO.ApplicationUserId;
                 
                _context.Entry(transferTransactionIn).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TransferTransactionInsExists(id))
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
        public async Task<IActionResult> Patch([FromODataUri] int key, Delta<TransferTransactionInDTO> transferTransactionInDTO)
        {
            if (_context.TransferTransactionIns == null)
            {
                return Problem("Entity set 'ApplicationDbContext.TransferTransactionIns'  is null.");
            }
            if (_userAuthService.getCurrentUserId() is null)
            {
                return Problem("Access denied");
            }

            var entity = await _context.TransferTransactionIns.FindAsync(key);

            if (entity == null)
            {
                return NotFound();
            }


            Delta<TransferTransactionIn> deltaTransferTransactionIn = TransferTransactionInDTO.toDeltaTransferTransactionIn(transferTransactionInDTO);

            deltaTransferTransactionIn.Patch(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransferTransactionInsExists(key))
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

        // POST: api/FinanceTransactionBuys
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPost("/odata/TransferTransactionIns")]
        public async Task<ActionResult<TransferTransactionIn>> PostTransferTransactionIn(TransferTransactionInDTO transferTransactionInDTO)
        {
            if (_context.TransferTransactionIns == null)
            {
                return Problem("Entity set 'ApplicationDbContext.TransferTransactionIns'  is null.");
            }


            else if (_userAuthService.getCurrentUserId() != null)
            {


                Coin? coins = _context.Coins?.Find(transferTransactionInDTO.CoinSymbol.ToString());

                if (coins == null)
                {

                    Coin coin = new Coin();

                    coin.Symbol = transferTransactionInDTO.CoinSymbol.ToString();

                    _context.Coins.Add(coin);
                    await _context.SaveChangesAsync();
                }


       
                TransferTransactionIn transferTransactionIn = transferTransactionInDTO.convertToTransferTransactionIn();
                //TODO: Add IDs based on claims


                transferTransactionIn.ApplicationUserId = _userAuthService.getCurrentUserId();
                transferTransactionIn.Id = 0;
                _context.TransferTransactionIns.Add(transferTransactionIn);
                await _context.SaveChangesAsync();

                transferTransactionInDTO.Id = transferTransactionIn.Id;
                transferTransactionInDTO.ApplicationUserId = transferTransactionIn.ApplicationUserId;

                return CreatedAtAction("GetTransferTransactionIn", new { id = transferTransactionInDTO.Id }, transferTransactionInDTO);
            }
            else
            {
                return BadRequest();
            }
        }

        // DELETE: api/TransferTransactionIns/5
        [EnableQuery]
        [HttpDelete("/odata/TransferTransactionIns({id})")]
        public async Task<IActionResult> DeleteTransferTransactionIns(int id)
        {
            if (_context.TransferTransactionIns == null)
            {
                return NotFound();
            }
            var transferTransactionIn = await _context.TransferTransactionIns.FindAsync(id);
            if (transferTransactionIn == null)
            {
                return NotFound();
            }

            _context.TransferTransactionIns.Remove(transferTransactionIn);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TransferTransactionInsExists(int id)
        {
            return (_context.TransferTransactionIns?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
